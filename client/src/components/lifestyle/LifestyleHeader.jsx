import { Activity } from "lucide-react";

export default function LifestyleHeader() {
  return (
    <section className="page-header">
      <div>
        <div className="flex items-center gap-3">
          <div className="icon-wrapper">
            <Activity size={24} className="text-blue-600" />
          </div>

          <h1 className="page-title">
            Lifestyle Score
          </h1>
        </div>

        <p className="mt-3 text-slate-600">
          Assess your daily habits and understand how they contribute to
          your overall lifestyle health.
        </p>
      </div>
    </section>
  );
}