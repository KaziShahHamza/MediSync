import { ArrowRight } from "lucide-react";

export default function StatCard({
  title,
  count,
  linkText,
  onClick,
  icon: Icon,
}) {
  return (
    <div className="ms-card ms-dashboard-stat-card">
      <div className="ms-dashboard-stat-top">
        <div className="ms-dashboard-stat-content">
          <p className="ms-dashboard-stat-label">{title}</p>

          <p className="ms-dashboard-stat-value">{count}</p>
        </div>

        {Icon && (
          <div className="ms-icon-box ms-dashboard-stat-icon">
            <Icon size={22} aria-hidden="true" />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onClick}
        className="ms-btn ms-btn-ghost ms-dashboard-stat-action"
      >
        <span>{linkText || "View"}</span>
        <ArrowRight size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

