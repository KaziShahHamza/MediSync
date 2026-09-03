// client/src/components/Navbar.jsx

import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Pill,
  HeartPulse,
  FileImage,
  Stethoscope,
  UserRound,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const navItem = (path, label, Icon) => (
    <Link
      to={path}
      className={`ms-nav-link ${
        isActive(path) ? "ms-nav-link-active" : ""
      }`}
      aria-current={isActive(path) ? "page" : undefined}
    >
      <Icon size={18} strokeWidth={2} aria-hidden="true" />
      <span>{label}</span>
    </Link>
  );

  return (
    <header className="ms-navbar">
      <div className="ms-container ms-navbar-inner">
        {/* Logo */}
        <Link to="/" className="ms-brand">
          <img
            src="/assets/icon_3.png"
            alt="MediSync"
            className="ms-brand-logo"
          />

          <div className="ms-brand-content">
            <h1 className="ms-brand-name">
              MediSync
            </h1>

            <p className="ms-brand-tagline">
              Personal Health Platform
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <nav
          className="ms-navbar-navigation"
          aria-label="Main navigation"
        >
          {!user && (
            <div className="ms-navbar-actions">
              <Link
                to="/login"
                className={`ms-nav-link ${
                  isActive("/login")
                    ? "ms-nav-link-active"
                    : ""
                }`}
                aria-current={
                  isActive("/login") ? "page" : undefined
                }
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="ms-btn ms-btn-primary"
              >
                Create Account
              </Link>
            </div>
          )}

          {user && (
            <div className="ms-navbar-actions">
              {navItem(
                "/dashboard",
                "Dashboard",
                LayoutDashboard
              )}

              {navItem(
                "/medicines",
                "Medicines",
                Pill
              )}

              {navItem(
                "/health",
                "Health",
                HeartPulse
              )}

              {navItem(
                "/doctors",
                "Doctors",
                Stethoscope
              )}

              {navItem(
                "/prescriptions",
                "Prescriptions",
                FileImage
              )}

              {navItem(
                "/profile",
                "Profile",
                UserRound
              )}

              <div
                className="ms-navbar-divider"
                aria-hidden="true"
              />

              <div className="ms-navbar-user">
                <span className="ms-navbar-user-name">
                  {user.name || "User"}
                </span>

                <span className="ms-navbar-user-email">
                  {user.email}
                </span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="ms-btn ms-btn-danger"
              >
                <LogOut
                  size={18}
                  strokeWidth={2}
                  aria-hidden="true"
                />

                <span>Logout</span>
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}