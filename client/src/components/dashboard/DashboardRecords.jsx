// client/src/components/dashboard/DashboardRecords.jsx

// Displays summary cards showing total counts for saved medicines,
// registered doctors, and uploaded prescription records.

import { FileImage, Pill, Stethoscope } from "lucide-react";

// Section component rendering summary metric cards
export default function DashboardRecords({ summary }) {
  return (
    <>
      <div className="section-header">
        <h2 className="section-title">Health Records Summary</h2>
      </div>

      {/* Record summary cards grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <RecordCard
          title="Medicines"
          count={summary.medicines}
          linkText="View Medicines"
          icon={Pill}
        />

        <RecordCard
          title="Doctors"
          count={summary.doctors}
          linkText="View Doctors"
          icon={Stethoscope}
        />

        <RecordCard
          title="Prescriptions"
          count={summary.prescriptions}
          linkText="View Prescriptions"
          icon={FileImage}
        />
      </div>
    </>
  );
}

// Card component displaying entity count and shortcut link
function RecordCard({ title, count, linkText, icon: Icon }) {
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>

          <p className="text-4xl font-bold text-slate-900 mt-3">{count}</p>
        </div>

        <div className="icon-wrapper">
          <Icon size={22} className="text-blue-600" />
        </div>
      </div>

      <button
        type="button"
        className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition duration-150"
      >
        {linkText}
      </button>
    </div>
  );
}
