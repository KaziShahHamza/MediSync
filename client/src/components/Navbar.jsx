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
  Sun,
  Moon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const navItem = (path, label, Icon) => {
    const active = isActive(path);

    return (
      <Link
        to={path}
        className={`ms-nav-link ${active ? "ms-nav-link-active" : ""}`}
        aria-current={active ? "page" : undefined}
        title={label}
      >
        <Icon size={18} strokeWidth={2} aria-hidden="true" />

        <span>{label}</span>
      </Link>
    );
  };

  const themeLabel =
    theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  const ThemeToggle = ({ mobile = false }) => (
    <button
      type="button"
      onClick={toggleTheme}
      className={`ms-theme-toggle ${mobile ? "ms-theme-toggle-mobile" : ""}`}
      aria-label={themeLabel}
      title={themeLabel}
    >
      {theme === "dark" ? (
        <Sun size={18} strokeWidth={2} aria-hidden="true" />
      ) : (
        <Moon size={18} strokeWidth={2} aria-hidden="true" />
      )}

      <span>{mobile ? "Appearance" : theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );

  return (
    <header className="ms-navbar">
      <div className="ms-container ms-navbar-inner">
        {/* Brand */}
        <Link to="/" className="ms-brand" aria-label="MediSync home">
          <img
            src="/assets/icon_3.png"
            alt="MediSync"
            className="ms-brand-logo"
          />

          <div className="ms-brand-content">
            <h1 className="ms-brand-name">MediSync</h1>

            <p className="ms-brand-tagline">Personal Health Platform</p>
          </div>
        </Link>

        {/* Main Navigation */}
        <nav className="ms-navbar-navigation" aria-label="Main navigation">
          {!user && (
            <div className="ms-navbar-actions">
              <ThemeToggle />

              <Link
                to="/login"
                className={`ms-nav-link ${
                  isActive("/login") ? "ms-nav-link-active" : ""
                }`}
                aria-current={isActive("/login") ? "page" : undefined}
              >
                <span>Login</span>
              </Link>

              <Link to="/signup" className="ms-btn ms-btn-primary">
                Create Account
              </Link>
            </div>
          )}

          {user && (
            <div className="ms-navbar-actions">
              {navItem("/dashboard", "Dashboard", LayoutDashboard)}

              {navItem("/medicines", "Medicines", Pill)}

              {navItem("/health", "Health", HeartPulse)}

              {navItem("/doctors", "Doctors", Stethoscope)}

              {navItem("/prescriptions", "Prescriptions", FileImage)}

              {navItem("/profile", "Profile", UserRound)}

              <div className="ms-navbar-divider" aria-hidden="true" />

              {/* Desktop Theme Toggle */}
              <ThemeToggle />

              <div className="ms-navbar-user">
                <span className="ms-navbar-user-name">
                  {user.name || "User"}
                </span>

                <span className="ms-navbar-user-email">{user.email}</span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="ms-btn ms-btn-danger"
                title="Logout"
              >
                <LogOut size={18} strokeWidth={2} aria-hidden="true" />

                <span>Logout</span>
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* Mobile Theme Control */}
      <div className="ms-navbar-mobile-theme">
        <div className="ms-container">
          <ThemeToggle mobile />
        </div>
      </div>
    </header>
  );
}
