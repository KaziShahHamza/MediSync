// client/src/components/profile/EmergencyCardExport.jsx

// Renders the emergency-card export section for the user's profile.
// Handles PDF generation state, errors, and download actions.

import { useState } from "react";
import { Download, FileText } from "lucide-react";

import { generateEmergencyCardPdf } from "../../utils/emergencyCard/emergencyCardPdf";

export default function EmergencyCardExport({ profile, userInfo }) {
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  // Generates the emergency card PDF while preventing duplicate requests.
  const handleDownload = async () => {
    if (generating) return;

    try {
      setError("");
      setGenerating(true);

      await generateEmergencyCardPdf(profile, userInfo);
    } catch (err) {
      console.error("Failed to generate emergency card PDF:", err);
      setError("Unable to generate the PDF. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  // Displays the export information and PDF download action.
  return (
    <section className="card p-6 m-3">
      {/* Export card header and download action */}
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex gap-4">
          <div className="surface-muted w-11 h-11 rounded-xl flex items-center justify-center shrink-0">
            <FileText size={21} className="text-sky-600" />
          </div>

          <div>
            <h2 className="card-title text-xl">MediSync Emergency Card</h2>

            <p className="text-sm text-muted mt-1 max-w-2xl">
              Keep a printed copy in your wallet.
            </p>
          </div>
        </div>

        {/* PDF generation trigger */}
        <button
          type="button"
          onClick={handleDownload}
          disabled={generating}
          className="btn-primary inline-flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Download size={17} />

          {generating ? "Generating PDF..." : "Download Emergency Card"}
        </button>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
