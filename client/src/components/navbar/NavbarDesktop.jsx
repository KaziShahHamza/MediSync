// client/src/components/navbar/NavbarDesktop.jsx

// Desktop layout navigation component rendering full menu bars and drop-down links.

import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  ChevronDown,
  Droplets,
  FileBarChart,
  FileImage,
  LayoutDashboard,
  LogOut,
  Pill,
  Settings,
  Stethoscope,
  UserRound,
  HeartPulse,
  Coffee,
  Sparkles,
} from "lucide-react";

import { NavbarDropdown } from "./Navbar";

// Renders desktop navigation menu items and dropdowns
export default function NavbarDesktop({
  user,
  username,
  onNavigation,
  onLogout,
}) {
  const location = useLocation();
  const navigate = useNavigate();

  // Helper function to check if current route matches given path
  const isActive = (path) => location.pathname === path;

  // Determines active state for medical documents section
  const isDocumentsActive =
    location.pathname === "/prescriptions" ||
    location.pathname === "/reports" ||
    location.pathname === "/medicines" ||
    location.pathname === "/doctors";

  // Determines active state for general health section
  const isHealthActive =
    location.pathname === "/health" || location.pathname === "/lifestyle";

  // Determines active state for account management section
  const isAccountActive =
    location.pathname === "/profile" || location.pathname === "/settings";

  // Helper component to render styled navigation link items
  const navItem = (path, label, Icon) => (
    <Link
      to={path}
      onClick={onNavigation}
      className={`nav-link ${isActive(path) ? "nav-link-active" : ""}`}
    >
      <Icon size={18} strokeWidth={2} />
      <span>{label}</span>
    </Link>
  );

  // Handles session logout and page redirect
  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  // Renders container element visible only on desktop viewports
  return (
    <div className="hidden lg:flex items-center">
      {/* Dropdown menu for blood donation services */}
      <NavbarDropdown>
        <button
          type="button"
          className={`nav-link ${
            location.pathname === "/blood-search" ||
            location.pathname === "/blood-request"
              ? "nav-link-active"
              : ""
          }`}
        >
          <Droplets size={18} strokeWidth={2} />

          <span>Need Blood?</span>

          <ChevronDown size={15} strokeWidth={2} />
        </button>

        {/* Links for blood searching and posting requests */}
        <div className="navbar-dropdown">
          <Link
            to="/blood-search"
            onClick={onNavigation}
            className={`navbar-dropdown-item ${
              isActive("/blood-search") ? "navbar-dropdown-item-active" : ""
            }`}
          >
            <Activity size={17} />
            <span>Search Blood Donors</span>
          </Link>

          <Link
            to="/blood-request"
            onClick={onNavigation}
            className={`navbar-dropdown-item ${
              isActive("/blood-request") ? "navbar-dropdown-item-active" : ""
            }`}
          >
            <Sparkles size={17} />
            <span>Post Blood Request</span>
          </Link>
        </div>
      </NavbarDropdown>

      {/* Render unauthenticated user links */}
      {!user && (
        <>
          <Link
            to="/login"
            className={`nav-link ${
              isActive("/login") ? "nav-link-active" : ""
            }`}
          >
            Login
          </Link>

          <Link to="/signup" className="btn-primary">
            Create Account
          </Link>
        </>
      )}

      {/* Render authenticated user navigation options */}
      {user && (
        <>
          {/* Main user dashboard link */}
          {navItem("/dashboard", "Dashboard", LayoutDashboard)}

          {/* Health overview dropdown section */}
          <NavbarDropdown>
            <button
              type="button"
              className={`nav-link ${isHealthActive ? "nav-link-active" : ""}`}
            >
              <HeartPulse size={18} strokeWidth={2} />

              <span>Health Overview</span>

              <ChevronDown size={15} strokeWidth={2} />
            </button>

            {/* Health tools navigation links */}
            <div className="navbar-dropdown">
              <Link
                to="/health"
                onClick={onNavigation}
                className={`navbar-dropdown-item ${
                  isActive("/health") ? "navbar-dropdown-item-active" : ""
                }`}
              >
                <Activity size={17} />
                <span>Health Charts</span>
              </Link>

              <Link
                to="/assistant"
                onClick={onNavigation}
                className={`navbar-dropdown-item ${
                  isActive("/assistant") ? "navbar-dropdown-item-active" : ""
                }`}
              >
                <Sparkles size={17} />
                <span>AI Chat</span>
              </Link>

              <Link
                to="/lifestyle"
                onClick={onNavigation}
                className={`navbar-dropdown-item ${
                  isActive("/lifestyle") ? "navbar-dropdown-item-active" : ""
                }`}
              >
                <Coffee size={17} />
                <span>My Lifestyle</span>
              </Link>
            </div>
          </NavbarDropdown>

          {/* Medical records dropdown section */}
          <NavbarDropdown>
            <button
              type="button"
              className={`nav-link ${
                isDocumentsActive ? "nav-link-active" : ""
              }`}
            >
              <FileImage size={18} strokeWidth={2} />

              <span>Medical Records</span>

              <ChevronDown size={15} strokeWidth={2} />
            </button>

            {/* Medical history options */}
            <div className="navbar-dropdown">
              <Link
                to="/medicines"
                onClick={onNavigation}
                className={`navbar-dropdown-item ${
                  isActive("/medicines") ? "navbar-dropdown-item-active" : ""
                }`}
              >
                <Pill size={17} />
                <span>My Medicines</span>
              </Link>

              <Link
                to="/doctors"
                onClick={onNavigation}
                className={`navbar-dropdown-item ${
                  isActive("/doctors") ? "navbar-dropdown-item-active" : ""
                }`}
              >
                <Stethoscope size={17} />
                <span>My Doctors</span>
              </Link>

              <Link
                to="/prescriptions"
                onClick={onNavigation}
                className={`navbar-dropdown-item ${
                  isActive("/prescriptions")
                    ? "navbar-dropdown-item-active"
                    : ""
                }`}
              >
                <FileImage size={17} />
                <span>My Prescriptions</span>
              </Link>

              <Link
                to="/reports"
                onClick={onNavigation}
                className={`navbar-dropdown-item ${
                  isActive("/reports") ? "navbar-dropdown-item-active" : ""
                }`}
              >
                <FileBarChart size={17} />
                <span>My Reports</span>
              </Link>
            </div>
          </NavbarDropdown>

          {/* Account profile and settings menu */}
          <NavbarDropdown className="ml-2">
            <button
              type="button"
              className={`navbar-account ${
                isAccountActive ? "navbar-account-active" : ""
              }`}
            >
              <UserRound size={18} strokeWidth={2} />

              <span>Welcome, {username}</span>

              <ChevronDown size={15} strokeWidth={2} />
            </button>

            {/* User profile actions */}
            <div className="navbar-dropdown navbar-dropdown-account">
              <Link
                to="/profile"
                onClick={onNavigation}
                className={`navbar-dropdown-item ${
                  isActive("/profile") ? "navbar-dropdown-item-active" : ""
                }`}
              >
                <UserRound size={17} />
                <span>Profile</span>
              </Link>

              <Link
                to="/settings"
                onClick={onNavigation}
                className={`navbar-dropdown-item ${
                  isActive("/settings") ? "navbar-dropdown-item-active" : ""
                }`}
              >
                <Settings size={17} />
                <span>Settings</span>
              </Link>

              <div className="navbar-dropdown-divider" />

              {/* Logout button component */}
              <button
                type="button"
                onClick={handleLogout}
                className="navbar-dropdown-item navbar-dropdown-danger"
              >
                <LogOut size={17} />
                <span>Logout</span>
              </button>
            </div>
          </NavbarDropdown>
        </>
      )}
    </div>
  );
}
