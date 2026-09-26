// client/src/pages/Dashboard.jsx

// Renders the main MediSync dashboard.
// Combines health data, AI summary information, records, and quick actions.

import { useAuth } from "../context/AuthContext";
import { useLifestyle } from "../context/LifestyleContext";

import useDashboard from "../hooks/useDashboard";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardSummary from "../components/dashboard/DashboardSummary";
import DashboardHealthOverview from "../components/dashboard/DashboardHealthOverview";
import DashboardRecords from "../components/dashboard/DashboardRecords";
import DashboardQuickActions from "../components/dashboard/DashboardQuickActions";

// Provides the aggregated dashboard view for authenticated users.
export default function Dashboard() {
  const { user } = useAuth();
  const { latestAssessment } = useLifestyle();

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

  // Displays the initial dashboard loading state.
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

  return (
    <div className="container page">
      {/* Dashboard greeting and export controls. */}
      <DashboardHeader
        user={user}
        greeting={greeting}
        time={time}
        pdfLoading={pdfLoading}
        onExportPDF={handleExportPDF}
      />

      {/* AI and lifestyle summary section. */}
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

      {/* Latest health metrics and trends. */}
      <section className="section">
        <DashboardHealthOverview health={data.health} />
      </section>

      {/* Record counts and recent health records. */}
      <section className="section">
        <DashboardRecords summary={data.summary} />
      </section>

      {/* Navigation shortcuts for common dashboard actions. */}
      <section className="section">
        <DashboardQuickActions />
      </section>
    </div>
  );
}
