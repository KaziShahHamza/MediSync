// client/src/components/BMIChart.jsx

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
import { TrendingUp, Activity } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);

export default function BMIChart({ logs, height }) {
  // Get only weight logs
  const weightLogs = logs.filter((log) => log.type === "weight");

  // Get height from profile
  const feet = Number(height?.feet) || 0;
  const inches = Number(height?.inches) || 0;

  // Convert height to meters
  const totalInches = feet * 12 + inches;
  const heightMeters = totalInches * 0.0254;

  // Calculate BMI for every weight log
  const bmiData =
    heightMeters > 0
      ? weightLogs.map((log) => ({
          ...log,
          bmi: Number(
            (
              Number(log.weight) /
              (heightMeters * heightMeters)
            ).toFixed(1)
          ),
        }))
      : [];

  return (
    <div className="card min-h-[380px]">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp size={22} className="text-blue-600" />

        <h3 className="card-title">BMI History</h3>
      </div>

      {!heightMeters ? (
        <div className="h-72 flex flex-col items-center justify-center text-center">
          <Activity size={40} className="text-slate-300" />

          <p className="mt-4 text-slate-500">
            Please add your height in your profile first.
          </p>
        </div>
      ) : bmiData.length === 0 ? (
        <div className="h-72 flex flex-col items-center justify-center text-center">
          <Activity size={40} className="text-slate-300" />

          <p className="mt-4 text-slate-500">
            No weight records available yet.
          </p>
        </div>
      ) : (
        <Line
          data={{
            labels: bmiData.map((log) =>
              new Date(log.createdAt).toLocaleDateString()
            ),

            datasets: [
              {
                label: "BMI",

                data: bmiData.map((log) => log.bmi),

                borderColor: "#2563EB",

                backgroundColor: "#2563EB33",

                tension: 0.3,
              },
            ],
          }}
        />
      )}
    </div>
  );
}