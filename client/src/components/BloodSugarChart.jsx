// client/src/components/BloodSugarChart.jsx

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Droplets, Activity } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
);

function getRecordedDate(log) {
  return log.recordedAt || log.createdAt;
}

function getCalendarDate(log) {
  const value = getRecordedDate(log);

  if (!value) return null;

  // New records use YYYY-MM-DD.
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  // Older records fall back to createdAt.
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatChartDate(dateString) {
  const [year, month, day] = dateString.split("-");

  const date = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
  );

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function BloodSugarChart({ logs }) {
  const diabetesLogs = logs.filter(
    (log) =>
      log.type === "diabetes" &&
      log.glucose != null &&
      log.glucoseTiming &&
      ["fasting", "postMeal", "random"].includes(log.glucoseTiming),
  );

  const groupedByDate = {};

  diabetesLogs.forEach((log) => {
    const date = getCalendarDate(log);

    if (!date) return;

    if (!groupedByDate[date]) {
      groupedByDate[date] = {
        fasting: null,
        postMeal: null,
        random: null,
      };
    }

    const existingLog = groupedByDate[date][log.glucoseTiming];

    // Keep the latest saved reading for this date and timing.
    if (
      !existingLog ||
      new Date(log.createdAt).getTime() >
        new Date(existingLog.createdAt).getTime()
    ) {
      groupedByDate[date][log.glucoseTiming] = log;
    }
  });

  const dates = Object.keys(groupedByDate)
    .sort((a, b) => a.localeCompare(b))
    .slice(-10);

  const chartData = {
    labels: dates.map(formatChartDate),

    datasets: [
      {
        label: "Fasting",
        data: dates.map((date) =>
          groupedByDate[date].fasting
            ? groupedByDate[date].fasting.glucose
            : null,
        ),
        borderColor: "#2563EB",
        backgroundColor: "#2563EB33",
        tension: 0.3,
        spanGaps: false,
      },

      {
        label: "2 Hours After Meal",
        data: dates.map((date) =>
          groupedByDate[date].postMeal
            ? groupedByDate[date].postMeal.glucose
            : null,
        ),
        borderColor: "#16A34A",
        backgroundColor: "#16A34A33",
        tension: 0.3,
        spanGaps: false,
      },

      {
        label: "Random",
        data: dates.map((date) =>
          groupedByDate[date].random
            ? groupedByDate[date].random.glucose
            : null,
        ),
        borderColor: "#22b6ae",
        backgroundColor: "#22b6af57",
        tension: 0.3,
        spanGaps: false,
      },
    ],
  };

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <Droplets size={22} className="text-blue-600" />

        <h3 className="card-title">Blood Sugar History (Last 10 Days)</h3>
      </div>

      {dates.length === 0 ? (
        <div className="h-90 flex flex-col items-center justify-center text-center">
          <Activity size={40} className="text-slate-300" />

          <p className="mt-4 text-slate-500">
            No blood sugar records available.
          </p>
        </div>
      ) : (
        <div className="h-90">
          <Line
            data={chartData}
            options={{
              responsive: true,
              // maintainAspectRatio: false,
            }}
          />
        </div>
      )}
    </div>
  );
}