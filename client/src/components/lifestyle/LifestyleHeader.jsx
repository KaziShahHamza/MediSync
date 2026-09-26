// client/src/components/lifestyle/LifestyleHeader.jsx

// Provides the main header layout for the lifestyle assessment page.
// Displays the page title, icon, and introductory description.

import { Activity } from "lucide-react";

// Renders the lifestyle page heading and introductory text.
export default function LifestyleHeader() {
  // Groups the title and description into the shared page header layout.
  return (
    <section className="page-header">
      <div>
        <div className="flex items-center gap-3">
          <div className="icon-wrapper">
            <Activity size={24} className="text-blue-600" />
          </div>

          <h1 className="page-title">Lifestyle Score</h1>
        </div>

        <p className="mt-3 text-slate-600">
          Assess your daily habits and understand how they contribute to your
          overall lifestyle health.
        </p>
      </div>
    </section>
  );
}
