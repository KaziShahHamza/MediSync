// client/src/components/dashboard/DashboardHealthOverview.jsx

// Displays core vital signs and health readings including Blood Pressure,
// Blood Sugar measurements, and calculated BMI.

import { Activity, Droplets, HeartPulse } from "lucide-react";

// Main container component rendering health metric cards in a responsive grid
export default function DashboardHealthOverview({ health }) {
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

// Card wrapper for displaying individual metric titles, values, and icons
function HealthMetricCard({ title, value, subtitle, icon: Icon }) {
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

// Formats diabetes reading sub-values for fasting, post-meal, and random tests
function BloodSugarValue({ diabetes }) {
  if (
    !diabetes ||
    (!diabetes.fasting && !diabetes.postMeal && !diabetes.random)
  ) {
    return null;
  }

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
