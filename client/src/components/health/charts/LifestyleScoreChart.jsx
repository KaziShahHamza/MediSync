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
import { Activity } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
);

export default function LifestyleScoreChart({ assessments }) {
  const lifestyleAssessments = [...(assessments || [])]
    .filter((assessment) => assessment?.assessedAt)
    .sort(
      (a, b) =>
        new Date(a.assessedAt) - new Date(b.assessedAt),
    )
    .slice(-10);

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-6">
        <Activity size={22} className="text-blue-600" />

        <div>
          <h3 className="card-title">
            Lifestyle Score History (Last 10 Assessments)
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Track how your lifestyle score changes over time.
          </p>
        </div>
      </div>

      {lifestyleAssessments.length === 0 ? (
        <div className="h-72 flex flex-col items-center justify-center text-center">
          <Activity size={40} className="text-slate-300" />

          <p className="mt-4 text-slate-500">
            No lifestyle assessments available yet.
          </p>

          <p className="text-sm text-slate-400 mt-1">
            Complete and save an assessment to start tracking your score.
          </p>
        </div>
      ) : (
        <div className="h-90">
          <Line
            data={{
              labels: lifestyleAssessments.map((assessment) =>
                new Date(
                  assessment.assessedAt,
                ).toLocaleDateString(),
              ),

              datasets: [
                {
                  label: "Lifestyle Score",

                  data: lifestyleAssessments.map(
                    (assessment) =>
                      Number(assessment.totalScore) || 0,
                  ),

                  borderColor: "#2563EB",
                  backgroundColor: "#2563EB33",

                  tension: 0.3,

                  pointRadius: 4,
                  pointHoverRadius: 6,
                },
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,

              scales: {
                y: {
                  min: 0,
                  max: 100,

                  ticks: {
                    stepSize: 20,
                  },

                  title: {
                    display: true,
                    text: "Score",
                  },
                },

                x: {
                  title: {
                    display: true,
                    text: "Assessment Date",
                  },
                },
              },

              plugins: {
                legend: {
                  display: true,
                },

                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const assessment =
                        lifestyleAssessments[
                          context.dataIndex
                        ];

                      return `Score: ${
                        assessment.totalScore
                      } / 100`;

                    },

                    afterLabel: (context) => {
                      const assessment =
                        lifestyleAssessments[
                          context.dataIndex
                        ];

                      return `Grade: ${
                        assessment.grade
                      }`;
                    },
                  },
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
}
