// client/src/components/home/HomeHealthSection.jsx

// Renders the homepage health tracking section.
// Highlights the primary health metrics supported by MediSync.

import { Activity, Droplets, Scale } from "lucide-react";

export default function HomeHealthSection() {
  return (
    <section className="container section">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="page-title">Monitor your health trends</h2>

          <p className="mt-5 text-slate-600 leading-relaxed">
            Track important health indicators over time. Historical records help
            you understand changes and make better decisions with your
            healthcare provider.
          </p>

          {/* Display quick-reference cards for supported health metrics. */}
          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            <div className="surface p-4">
              <Scale size={22} className="text-blue-600" />

              <p className="mt-3 text-sm font-medium text-slate-700">
                BMI Tracking
              </p>
            </div>

            <div className="surface p-4">
              <Activity size={22} className="text-blue-600" />

              <p className="mt-3 text-sm font-medium text-slate-700">
                Blood Pressure
              </p>
            </div>

            <div className="surface p-4">
              <Droplets size={22} className="text-blue-600" />

              <p className="mt-3 text-sm font-medium text-slate-700">
                Blood Sugar
              </p>
            </div>
          </div>
        </div>

        {/* Present the analytics preview placeholder. */}
        <div className="card min-h-[320px] flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <Activity size={48} className="mx-auto text-blue-600" />

            <h3 className="mt-5 text-xl font-semibold text-slate-900">
              Health Analytics
            </h3>

            <p className="mt-2 text-slate-500">
              Charts and health trends will appear here.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
