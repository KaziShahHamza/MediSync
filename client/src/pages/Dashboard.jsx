import { useEffect, useState } from "react";

import {
  Activity,
  CalendarClock,
  Download,
  Droplets,
  FileImage,
  HeartPulse,
  Pill,
  Stethoscope,
  UserRound,
} from "lucide-react";

import HealthSummaryCard from "../components/dashboard/HealthSummaryCard";
import StatCard from "../components/dashboard/StatCard";
import QuickLinkCard from "../components/dashboard/QuickLinkCard";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const [data, setData] = useState(null);

  const [aiSummary, setAiSummary] = useState(null);
  const [aiGeneratedAt, setAiGeneratedAt] = useState(null);
  const [aiLoading, setAiLoading] = useState(true);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiMessage, setAiMessage] = useState("");

  const [pdfLoading, setPdfLoading] = useState(false);

  const [time, setTime] = useState(new Date());

  const { user } = useAuth();

  // Dashboard data
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_URL}/api/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load dashboard");
        }

        return res.json();
      })
      .then((result) => {
        setData(result);
      })
      .catch((err) => {
        console.error("Dashboard loading failed:", err);
      });
  }, []);

  // AI summary
  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_URL}/api/ai/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load AI summary");
        }

        return res.json();
      })
      .then((result) => {
        setAiSummary(result.summary);
        setAiGeneratedAt(result.generatedAt);
        setAiMessage(result.message || "");
      })
      .catch((err) => {
        console.error("AI summary loading failed:", err);

        setAiMessage("Unable to load the AI health summary right now.");
      })
      .finally(() => {
        setAiLoading(false);
      });
  }, []);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Manual AI generation
  async function handleGenerateSummary() {
    const token = localStorage.getItem("token");

    setAiGenerating(true);
    setAiMessage("");

    try {
      const response = await fetch(`${API_URL}/api/ai/summary/generate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to generate summary");
      }

      setAiSummary(result.summary);
      setAiGeneratedAt(result.generatedAt);
      setAiMessage("");
    } catch (err) {
      console.error("AI summary generation failed:", err);

      setAiMessage(err.message || "Failed to generate AI summary.");
    } finally {
      setAiGenerating(false);
    }
  }

  // Export health report as PDF
  async function handleExportPDF() {
    const token = localStorage.getItem("token");

    setPdfLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/export/health-report`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);

        throw new Error(result?.message || "Failed to generate PDF report");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `MediSync-Health-Report-${
        new Date().toISOString().split("T")[0]
      }.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF export failed:", err);

      alert(err.message || "Failed to export health report. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  }

  if (!data) {
    return (
      <main className="ms-page ms-dashboard-page">
        <div className="ms-container">
          <div className="ms-dashboard-loading">
            <div className="ms-dashboard-skeleton-grid">
              <div className="ms-skeleton ms-dashboard-skeleton-card" />
              <div className="ms-skeleton ms-dashboard-skeleton-card" />
              <div className="ms-skeleton ms-dashboard-skeleton-card" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  const greeting =
    time.getHours() < 12
      ? "Morning"
      : time.getHours() < 18
        ? "Afternoon"
        : "Evening";

  return (
    <main className="ms-page ms-dashboard-page">
      <div className="ms-container">
        {/* Dashboard Header */}
        <section className="ms-page-header ms-dashboard-header">
          <div className="ms-dashboard-header-row">
            <div className="ms-dashboard-heading">
              <span className="ms-dashboard-eyebrow">
                Personal Health Dashboard
              </span>

              <h1 className="ms-page-title">
                Good {greeting}, {user?.name || ""}
              </h1>

              <p className="ms-page-subtitle">
                Monitor your health activity and manage your healthcare
                information from one place.
              </p>
            </div>

            <div className="ms-dashboard-header-actions">
              <button
                type="button"
                onClick={handleExportPDF}
                disabled={pdfLoading}
                className="ms-btn ms-btn-primary ms-dashboard-export-btn"
              >
                <Download size={18} aria-hidden="true" />

                <span>
                  {pdfLoading ? "Generating Report..." : "Export Health Report"}
                </span>
              </button>

              <div className="ms-dashboard-clock">
                <div className="ms-dashboard-clock-icon" aria-hidden="true">
                  <CalendarClock size={20} />
                </div>

                <div className="ms-dashboard-clock-content">
                  <p className="ms-dashboard-clock-date">
                    {time.toLocaleDateString()}
                  </p>

                  <p className="ms-dashboard-clock-time">
                    {time.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI / Health Summary */}
        <section className="ms-section ms-dashboard-section">
          <HealthSummaryCard
            summary={aiSummary}
            loading={aiLoading}
            generating={aiGenerating}
            generatedAt={aiGeneratedAt}
            message={aiMessage}
            onGenerate={handleGenerateSummary}
          />
        </section>

        {/* Health Overview */}
        <section className="ms-section ms-dashboard-section">
          <div className="ms-section-header">
            <div>
              <span className="ms-dashboard-section-eyebrow">
                Latest measurements
              </span>

              <h2 className="ms-section-title">Health Overview</h2>
            </div>
          </div>

          <div className="ms-grid ms-dashboard-health-grid">
            <HealthSummaryCard
              title="Blood Pressure"
              value={
                data.health.bloodPressure
                  ? `${data.health.bloodPressure.high}/${data.health.bloodPressure.low}`
                  : null
              }
              subtitle="Latest reading"
              icon={HeartPulse}
            />

            <HealthSummaryCard
              title="Blood Sugar"
              value={
                data.health.diabetes
                  ? `${data.health.diabetes.glucose} mmol/L`
                  : null
              }
              subtitle="Latest glucose level"
              icon={Droplets}
            />

            <HealthSummaryCard
              title="BMI"
              value={data.health.bmi ? data.health.bmi.value : null}
              subtitle="Latest BMI"
              icon={Activity}
            />
          </div>
        </section>

        {/* Summary Statistics */}
        <section className="ms-section ms-dashboard-section">
          <div className="ms-section-header">
            <div>
              <span className="ms-dashboard-section-eyebrow">Your records</span>

              <h2 className="ms-section-title">Health Records Summary</h2>
            </div>
          </div>

          <div className="ms-grid ms-dashboard-stat-grid">
            <StatCard
              title="Medicines"
              count={data.summary.medicines}
              linkText="View Medicines"
              icon={Pill}
            />

            <StatCard
              title="Doctors"
              count={data.summary.doctors}
              linkText="View Doctors"
              icon={Stethoscope}
            />

            <StatCard
              title="Prescriptions"
              count={data.summary.prescriptions}
              linkText="View Prescriptions"
              icon={FileImage}
            />
          </div>
        </section>

        {/* Quick Actions */}
        <section className="ms-section ms-dashboard-section">
          <div className="ms-section-header">
            <div>
              <span className="ms-dashboard-section-eyebrow">
                Manage your records
              </span>

              <h2 className="ms-section-title">Quick Actions</h2>
            </div>
          </div>

          <div className="ms-grid ms-dashboard-quick-grid">
            <QuickLinkCard
              title="Medicines"
              description="Manage medicines and dosage schedules"
              path="/medicines"
              icon={Pill}
            />

            <QuickLinkCard
              title="Health Charts"
              description="Review health history and trends"
              path="/health"
              icon={Activity}
            />

            <QuickLinkCard
              title="Doctors"
              description="Manage your healthcare providers"
              path="/doctors"
              icon={Stethoscope}
            />

            <QuickLinkCard
              title="Prescriptions"
              description="View uploaded medical records"
              path="/prescriptions"
              icon={FileImage}
            />

            <QuickLinkCard
              title="Profile"
              description="Update personal health information"
              path="/profile"
              icon={UserRound}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
