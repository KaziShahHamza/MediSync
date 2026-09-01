// client/src/pages/Dashboard.jsx

import { useEffect, useState } from "react";

import {
  Activity,
  Droplets,
  HeartPulse,
  Pill,
  Stethoscope,
  FileImage,
  UserRound,
  CalendarClock,
  Download,
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
      <div className="container page">
        {" "}
        <div className="grid gap-6 md:grid-cols-3">
          {" "}
          <div className="skeleton-card h-32" />
          <div className="skeleton-card h-32" />
          <div className="skeleton-card h-32" />
        </div>
      </div>
    );
  }

  const greeting =
    time.getHours() < 12
      ? "Morning"
      : time.getHours() < 18
        ? "Afternoon"
        : "Evening";

  return (
    <div className="container page">
      {/* Header */}{" "}
      <section className="page-header">
        {" "}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {" "}
          <div>
            {" "}
            <h1 className="page-title">
              Good {greeting}, {user?.name || ""}{" "}
            </h1>
            <p className="page-description">
              Monitor your health activity and manage your healthcare
              information from one place.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Export PDF */}
            <button
              onClick={handleExportPDF}
              disabled={pdfLoading}
              className="btn-primary inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Download size={18} />

              {pdfLoading ? "Generating Report..." : "Export Health Report"}
            </button>

            {/* Date & Time */}
            <div className="surface px-4 py-3 flex items-center gap-3">
              <CalendarClock size={20} className="text-blue-600" />

              <div>
                <p className="text-sm font-medium text-slate-700">
                  {time.toLocaleDateString()}
                </p>

                <p className="text-xs text-slate-500">
                  {time.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* AI / Health Summary */}
      <section className="section">
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
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Health Overview</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
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
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Health Records Summary</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
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
      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Quick Actions</h2>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
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
  );
}
