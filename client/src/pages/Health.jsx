// client/src/pages/Health.jsx

// Renders the health tracking page.
// Displays blood pressure, blood sugar, BMI, and lifestyle score data.

import { Activity, Droplets, HeartPulse, Scale } from "lucide-react";

import useHealthLogs from "../hooks/useHealthLogs";

import { useLifestyle } from "../context/LifestyleContext";
import { useProfile } from "../context/ProfileContext";

import LifestyleScoreCard from "../components/health/LifestyleScoreCard";
import LifestyleScoreChart from "../components/health/charts/LifestyleScoreChart";

import BMIForm from "../components/health/forms/BMIForm";
import BMIChart from "../components/health/charts/BMIChart";

import BloodPressureForm from "../components/health/forms/BloodPressureForm";
import BloodPressureChart from "../components/health/charts/BloodPressureChart";

import BloodSugarForm from "../components/health/forms/BloodSugarForm";
import BloodSugarChart from "../components/health/charts/BloodSugarChart";

// Provides health metric forms, charts, and lifestyle tracking.
export default function Health() {
  const { logs, addLog } = useHealthLogs();
  const { profile } = useProfile();
  const { assessments, latestAssessment } = useLifestyle();

  return (
    <div className="container page">
      {/* Page heading and health report introduction. */}
      <section className="page-header">
        <div>
          <div className="flex items-center gap-3">
            <div className="icon-wrapper">
              <HeartPulse size={24} className="text-blue-600" />
            </div>

            <h1 className="page-title">Health Report</h1>
          </div>

          <p className="mt-3 text-slate-600">
            Track your health metrics, review trends, and maintain your personal
            health history.
          </p>
        </div>
      </section>

      {/* Displays all health tracking sections. */}
      <section className="space-y-12">
        {/* Blood pressure tracking section. */}
        <div>
          <div className="mb-5 flex items-center gap-3">
            <HeartPulse size={22} className="text-blue-600" />
            <h2 className="section-title">Blood Pressure</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
            <BloodPressureForm onAdd={addLog} />
            <BloodPressureChart logs={logs} />
          </div>
        </div>

        {/* Blood sugar tracking section. */}
        <div>
          <div className="mb-5 flex items-center gap-3">
            <Droplets size={22} className="text-blue-600" />
            <h2 className="section-title">Blood Sugar</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
            <BloodSugarForm onAdd={addLog} />
            <BloodSugarChart logs={logs} />
          </div>
        </div>

        {/* BMI tracking section. */}
        <div>
          <div className="mb-5 flex items-center gap-3">
            <Scale size={22} className="text-blue-600" />
            <h2 className="section-title">BMI Tracking</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
            <BMIForm onAdd={addLog} />
            <BMIChart logs={logs} height={profile?.height} />
          </div>
        </div>

        {/* Lifestyle score tracking section. */}
        <div>
          <div className="mb-5 flex items-center gap-3">
            <Activity size={22} className="text-blue-600" />
            <h2 className="section-title">Lifestyle Score</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
            <LifestyleScoreCard assessment={latestAssessment} />
            <LifestyleScoreChart assessments={assessments} />
          </div>
        </div>
      </section>
    </div>
  );
}
