// client/src/pages/Dashboard.jsx

// Main dashboard page component that aggregates health summaries,
// medical metrics, record counts, and platform quick actions.

import { useAuth } from "../context/AuthContext";
import { useLifestyle } from "../context/LifestyleContext";

import useDashboard from "../hooks/useDashboard";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardSummary from "../components/dashboard/DashboardSummary";
import DashboardHealthOverview from "../components/dashboard/DashboardHealthOverview";
import DashboardRecords from "../components/dashboard/DashboardRecords";
import DashboardQuickActions from "../components/dashboard/DashboardQuickActions";

export default function Dashboard() {
  const { user } = useAuth();
  const { latestAssessment } = useLifestyle();

  // Fetch dashboard data, real-time clock, and report handlers
  const {
    data,
    aiSummary,
    aiGeneratedAt,
    aiLoading,
    aiGenerating,
    aiMessage,
    pdfLoading,
    time,
    greeting,
    handleGenerateSummary,
    handleExportPDF,
  } = useDashboard();

  // Show placeholder skeleton grid while initial dashboard data loads
  if (!data) {
    return (
      <div className="container page">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="skeleton-card h-32" />
          <div className="skeleton-card h-32" />
          <div className="skeleton-card h-32" />
        </div>
      </div>
    );
  }

  // Render populated dashboard sections once data is available
  return (
    <div className="container page">
      {/* Header */}
      <DashboardHeader
        user={user}
        greeting={greeting}
        time={time}
        pdfLoading={pdfLoading}
        onExportPDF={handleExportPDF}
      />

      {/* AI / Lifestyle Summary */}
      <section className="section">
        <DashboardSummary
          aiSummary={aiSummary}
          aiGeneratedAt={aiGeneratedAt}
          aiLoading={aiLoading}
          aiGenerating={aiGenerating}
          aiMessage={aiMessage}
          onGenerateSummary={handleGenerateSummary}
          latestAssessment={latestAssessment}
        />
      </section>

      {/* Health Overview */}
      <section className="section">
        <DashboardHealthOverview health={data.health} />
      </section>

      <section className="section">
        <DashboardRecords summary={data.summary} />
      </section>

      <section className="section">
        <DashboardQuickActions />
      </section>
    </div>
  );
}
