// client/src/components/dashboard/DashboardHealthOverview.jsx

// Displays the latest blood pressure, blood sugar, and BMI readings.
// Uses reusable metric and blood sugar display components.

import { Activity, Droplets, HeartPulse } from "lucide-react";

export default function DashboardHealthOverview({ health }) {
  // Render the main health overview metric grid.
  return (
    <>
      <div className="section-header">
        <h2 className="section-title">Health Overview</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <HealthMetricCard
          title="Blood Pressure"
          value={
            health.bloodPressure
              ? `${health.bloodPressure.high}/${health.bloodPressure.low}`
              : null
          }
          subtitle="Latest reading"
          icon={HeartPulse}
        />

        <HealthMetricCard
          title="Blood Sugar"
          value={<BloodSugarValue diabetes={health.diabetes} />}
          subtitle="Latest reading for each measurement type"
          icon={Droplets}
        />

        <HealthMetricCard
          title="BMI"
          value={health.bmi ? health.bmi.value : null}
          subtitle="Latest BMI"
          icon={Activity}
        />
      </div>
    </>
  );
}

// Render one reusable health metric card with its associated icon.
function HealthMetricCard({ title, value, subtitle, icon: Icon }) {
  // Display the metric value or a fallback when no reading exists.
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-medium text-slate-500">{title}</h3>

          <div className="text-3xl font-bold text-slate-900 mt-3">
            {value || "No data"}
          </div>
        </div>

        <div className="icon-wrapper">
          <Icon size={22} className="text-blue-600" />
        </div>
      </div>

      {subtitle && <p className="mt-4 text-sm text-slate-500">{subtitle}</p>}
    </div>
  );
}

// Format the available fasting, post-meal, and random glucose readings.
function BloodSugarValue({ diabetes }) {
  // Avoid rendering an empty blood sugar section when no readings exist.
  if (
    !diabetes ||
    (!diabetes.fasting && !diabetes.postMeal && !diabetes.random)
  ) {
    return null;
  }

  // Render only the blood sugar measurement types that are available.
  return (
    <div className="space-y-2 text-base">
      {diabetes.fasting && (
        <div>
          <span className="text-sm font-medium text-slate-500">Fasting:</span>{" "}
          {diabetes.fasting.glucose} mg/dL
        </div>
      )}

      {diabetes.postMeal && (
        <div>
          <span className="text-sm font-medium text-slate-500">
            2h After Meal:
          </span>{" "}
          {diabetes.postMeal.glucose} mg/dL
        </div>
      )}

      {diabetes.random && (
        <div>
          <span className="text-sm font-medium text-slate-500">Random:</span>{" "}
          {diabetes.random.glucose} mg/dL
        </div>
      )}
    </div>
  );
}
