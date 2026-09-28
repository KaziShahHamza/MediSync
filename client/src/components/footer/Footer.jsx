// client/src/components/footer/Footer.jsx

// Renders the global MediSync application footer.
// Provides navigation links, health information, and the application disclaimer.

import { Link } from "react-router-dom";
import {
  Activity,
  FileImage,
  HeartPulse,
  Pill,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

// Render the global application footer.
export default function Footer() {
  const { user } = useAuth();

  return (
    <footer className="site-footer">
      <div className="container">
        {/* Main footer content */}
        <div className="site-footer-main">
          {/* Application branding and description */}
          <div className="site-footer-brand">
            <Link to="/" className="site-footer-logo">
              <img
                src="/assets/icon_3.png"
                alt="MediSync"
                className="site-footer-logo-image"
              />

              <div>
                <h2 className="site-footer-title">MediSync</h2>
                <p className="site-footer-tagline">
                  Your Personal Health Platform
                </p>
              </div>
            </Link>

            <p className="site-footer-description">
              Organize your medicines, health records, doctors, and healthcare
              information in one secure personal health platform.
            </p>

            <div className="site-footer-security">
              <ShieldCheck size={17} />
              <span>Private and account-based health management</span>
            </div>
          </div>

          {/* Application navigation */}
          <div className="site-footer-column">
            <h3 className="site-footer-heading">Quick Links</h3>

            <nav className="site-footer-links">
              {user ? (
                <>
                  <FooterLink to="/dashboard" icon={Activity}>
                    Dashboard
                  </FooterLink>

                  <FooterLink to="/health" icon={HeartPulse}>
                    Health Charts
                  </FooterLink>

                  <FooterLink to="/medicines" icon={Pill}>
                    My Medicines
                  </FooterLink>
                </>
              ) : (
                <>
                  <FooterLink to="/" icon={HeartPulse}>
                    Home
                  </FooterLink>

                  <FooterLink to="/login" icon={Activity}>
                    Login
                  </FooterLink>

                  <FooterLink to="/signup" icon={Pill}>
                    Create Account
                  </FooterLink>
                </>
              )}
            </nav>
          </div>

          {/* Healthcare records navigation */}
          <div className="site-footer-column">
            <h3 className="site-footer-heading">Healthcare</h3>

            <nav className="site-footer-links">
              {user ? (
                <>
                  <FooterLink to="/doctors" icon={Stethoscope}>
                    My Doctors
                  </FooterLink>

                  <FooterLink to="/prescriptions" icon={FileImage}>
                    My Prescriptions
                  </FooterLink>

                  <FooterLink to="/reports" icon={FileImage}>
                    My Reports
                  </FooterLink>
                </>
              ) : (
                <>
                  <FooterLink to="/blood-search" icon={Activity}>
                    Find Blood Donors
                  </FooterLink>

                  <FooterLink to="/blood-request" icon={HeartPulse}>
                    Post Blood Request
                  </FooterLink>
                </>
              )}
            </nav>
          </div>
        </div>

        {/* Footer bottom section */}
        <div className="site-footer-bottom">
          <p>© {new Date().getFullYear()} MediSync. All rights reserved.</p>

          <p className="site-footer-disclaimer">
            MediSync is a personal health management tool and does not replace
            professional medical advice.
          </p>
        </div>
      </div>
    </footer>
  );
}

// Render a reusable footer navigation link with an optional icon.
function FooterLink({ to, icon: Icon, children }) {
  return (
    <Link to={to} className="site-footer-link">
      <Icon size={16} strokeWidth={2} />
      <span>{children}</span>
    </Link>
  );
}
