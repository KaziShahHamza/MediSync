import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function QuickLinkCard({
  title,
  description,
  path,
  icon: Icon,
}) {
  return (
    <Link
      to={path}
      className="ms-card ms-card-interactive ms-dashboard-quick-card"
    >
      <div className="ms-dashboard-quick-top">
        {Icon && (
          <div className="ms-icon-box ms-dashboard-quick-icon">
            <Icon size={22} aria-hidden="true" />
          </div>
        )}

        <span className="ms-dashboard-quick-arrow" aria-hidden="true">
          <ArrowRight size={18} />
        </span>
      </div>

      <div className="ms-dashboard-quick-content">
        <h3 className="ms-card-title ms-dashboard-quick-title">{title}</h3>

        <p className="ms-dashboard-quick-description">{description}</p>
      </div>
    </Link>
  );
}
