// client/src/components/dashboard/DashboardHeader.jsx

// Renders the dashboard greeting, formatted date/time, and health report export action.
// Displays the export loading state while the report is being generated.

import { CalendarClock, Download } from "lucide-react";

export default function DashboardHeader({
  user,
  greeting,
  time,
  pdfLoading,
  onExportPDF,
}) {
  // Format the current date with the weekday, day, and month.
  const formattedDate = time.toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  // Format the current time using a 12-hour AM/PM format.
  const formattedTime = time.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  // Render the dashboard greeting and action controls.
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

        <div className="flex items-center gap-3 flex-wrap">
          {/* Display the formatted current date and time supplied by the parent. */}
          <div className="surface px-4 py-3 flex items-center gap-3">
            <CalendarClock size={20} className="text-blue-600" />

            <div>
              <p className="text-sm font-medium text-slate-700">
                {formattedDate}
              </p>

              <p className="text-xs text-slate-500">{formattedTime}</p>
            </div>
          </div>

          {/* Keep export controls disabled during report generation. */}
          <button
            onClick={onExportPDF}
            disabled={pdfLoading}
            className="btn-primary inline-flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Download size={18} />
            {pdfLoading ? "Generating Report..." : "Export Health Report"}
          </button>
        </div>
      </div>
    </section>
  );
}
