// client/src/components/dashboard/DashboardHeader.jsx

// Displays the top greeting section of the dashboard with dynamic time
// and an action button to export the user's medical health report as a PDF.

import { CalendarClock, Download } from "lucide-react";

export default function DashboardHeader({
  user,
  greeting,
  time,
  pdfLoading,
  onExportPDF,
}) {
  return (
    <section className="page-header">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="page-title">
            Good {greeting}, {user?.name || ""}
          </h1>

          <p className="page-description">
            Monitor your health activity and manage your healthcare information
            from one place.
          </p>
        </div>

        {/* Action bar with PDF export trigger and live system clock display */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* PDF export button with loading state */}
          <button
            onClick={onExportPDF}
            disabled={pdfLoading}
            className="btn-primary inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Download size={18} />

            {pdfLoading ? "Generating Report..." : "Export Health Report"}
          </button>

          {/* Current date and time widget */}
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
  );
}
