// client/src/pages/Health.jsx

import { Droplets, HeartPulse, Scale } from "lucide-react";
import useHealthLogs from "../hooks/useHealthLogs";
import { useProfile } from "../context/ProfileContext";

import BMIForm from "../components/health/BMIForm";
import BMIChart from "../components/health/BMIChart";

import BloodPressureForm from "../components/health/BloodPressureForm";
import BloodPressureChart from "../components/health/BloodPressureChart";

import BloodSugarForm from "../components/health/BloodSugarForm";
import BloodSugarChart from "../components/health/BloodSugarChart";

export default function Health() {
  const { logs, addLog } = useHealthLogs();
  const { profile } = useProfile();

  return (
    <main className="ms-page ms-health-page">
      <div className="ms-container">
        {/* Page Header */}
        <section className="ms-page-header ms-health-header">
          <div className="ms-health-heading">
            <div className="ms-health-title-row">
              <div className="ms-icon-box ms-health-page-icon">
                <HeartPulse size={40} aria-hidden="true" />
              </div>

              <div>
                <span className="ms-health-eyebrow">Health monitoring</span>

                <h1 className="ms-page-title">Health Report</h1>
              </div>
            </div>

            <p className="ms-page-subtitle">
              Track your health metrics, review trends, and maintain your
              personal health history.
            </p>
          </div>
        </section>

        {/* Health Metrics */}
        <section className="ms-health-sections">
          {/* Blood Pressure */}
          <section className="ms-section ms-health-section">


            <div className="ms-health-metric-layout">
              <BloodPressureForm onAdd={addLog} />
              <BloodPressureChart logs={logs} />
            </div>
          </section>

          {/* Blood Sugar */}
          <section className="ms-section ms-health-section">
            <div className="ms-health-section-header">
              <div className="ms-health-section-heading">

              </div>
            </div>

            <div className="ms-health-metric-layout">
              <BloodSugarForm onAdd={addLog} />
              <BloodSugarChart logs={logs} />
            </div>
          </section>

          {/* BMI */}
          <section className="ms-section ms-health-section">

            <div className="ms-health-metric-layout">
              <BMIForm onAdd={addLog} />
              <BMIChart logs={logs} height={profile?.height} />
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
