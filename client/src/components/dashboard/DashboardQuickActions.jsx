// client/src/components/dashboard/DashboardQuickActions.jsx

// Renders a navigation grid of interactive shortcut cards linking to major
// features like medicines, health charts, doctors, and profile settings.

import {
  Activity,
  ArrowRight,
  FileImage,
  Pill,
  Stethoscope,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

// Configuration for available dashboard navigation shortcuts
const actions = [
  {
    title: "Medicines",
    description: "Manage medicines and dosage schedules",
    path: "/medicines",
    icon: Pill,
  },
  {
    title: "Health Charts",
    description: "Review health history and trends",
    path: "/health",
    icon: Activity,
  },
  {
    title: "Doctors",
    description: "Manage your healthcare providers",
    path: "/doctors",
    icon: Stethoscope,
  },
  {
    title: "Prescriptions",
    description: "View uploaded medical records",
    path: "/prescriptions",
    icon: FileImage,
  },
  {
    title: "Profile",
    description: "Update personal health information",
    path: "/profile",
    icon: UserRound,
  },
];

// Main section component rendering quick action cards
export default function DashboardQuickActions() {
  return (
    <>
      <div className="section-header">
        <h2 className="section-title">Quick Actions</h2>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {actions.map((action) => (
          <QuickActionCard key={action.path} {...action} />
        ))}
      </div>
    </>
  );
}

// Individual clickable card component routing to sub-pages
function QuickActionCard({ title, description, path, icon: Icon }) {
  return (
    <Link to={path} className="card group">
      <div className="flex items-start justify-between">
        <div className="icon-wrapper">
          <Icon
            size={22}
            className="text-blue-600 transition-colors duration-150"
          />
        </div>

        <ArrowRight
          size={18}
          className="text-slate-400 group-hover:text-blue-600 transition-colors duration-150"
        />
      </div>

      <h3 className="mt-6 text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-150">
        {title}
      </h3>

      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </Link>
  );
}
