// client/src/components/Navbar.jsx

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  ChevronDown,
  Droplets,
  FileBarChart,
  FileImage,
  LayoutDashboard,
  LogOut,
  Menu,
  Pill,
  Settings,
  Stethoscope,
  UserRound,
  HeartPulse,
  Bot,
  Smile,
  Flame,
  Heart,
  Coffee,
  Sun,
  Sparkles,
  Brain,
  X,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);

  const username = user?.username || user?.name || "User";

  const isActive = (path) => location.pathname === path;

  const isDocumentsActive =
    location.pathname === "/prescriptions" ||
    location.pathname === "/reports" ||
    location.pathname === "/medicines" ||
    location.pathname === "/doctors";

  const ishealthActive =
    location.pathname === "/health" || location.pathname === "/lifestyle";

  const isAccountActive =
    location.pathname === "/profile" || location.pathname === "/settings";

  const handleLogout = () => {
    setMobileOpen(false);
    logout();
    navigate("/");
  };

  const handleNavigation = () => {
    setMobileOpen(false);
  };

  const navItem = (path, label, Icon) => (
    <Link
      to={path}
      onClick={handleNavigation}
      className={`nav-link ${isActive(path) ? "nav-link-active" : ""}`}
    >
      <Icon size={18} strokeWidth={2} />
      <span>{label}</span>
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="container h-[67px] flex items-center justify-between gap-4">
        {/* =====================================================
            LOGO
        ====================================================== */}

        <Link
          to="/"
          onClick={handleNavigation}
          className="flex items-center gap-3 shrink-0"
        >
          <img
            src="/assets/icon_3.png"
            alt="MediSync"
            className="w-13 h-13 rounded-xl object-cover"
          />

          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-slate-900 leading-tight">
              MediSync
            </h1>

            <p className="text-xs text-slate-500">
              Your Personal Health Platform
            </p>
          </div>

          <span className="sm:hidden text-lg font-bold text-slate-900">
            MediSync
          </span>
        </Link>

        {/* =====================================================
            DESKTOP NAVIGATION
        ====================================================== */}

        <div className="hidden lg:flex items-center ">
          {/* Public navigation */}

          {/* <Link
            to="/blood-need"
            className={`nav-link ${
              isActive("/blood-need") ? "nav-link-active" : ""
            }`}
          >
            <Droplets size={18} strokeWidth={2} />
            <span>Need Blood?</span>
          </Link> */}

          <div className="navbar-dropdown-wrapper">
            <button
              type="button"
              className={`nav-link ${ishealthActive ? "nav-link-active" : ""}`}
            >
              <Droplets size={18} strokeWidth={2} />

              <span>Need Blood?</span>

              <ChevronDown size={15} strokeWidth={2} />
            </button>

            <div className="navbar-dropdown">
              <Link
                to="/blood-search"
                onClick={handleNavigation}
                className={`navbar-dropdown-item ${
                  isActive("/blood-search") ? "navbar-dropdown-item-active" : ""
                }`}
              >
                <Activity size={17} />
                <span>Find Blood</span>
              </Link>

              <Link
                to="/blod-request"
                onClick={handleNavigation}
                className={`navbar-dropdown-item ${
                  isActive("/blood-request")
                    ? "navbar-dropdown-item-active"
                    : ""
                }`}
              >
                <Sparkles size={17} />
                <span>Request Blood</span>
              </Link>

              <Link
                to="/blood-need"
                onClick={handleNavigation}
                className={`navbar-dropdown-item ${
                  isActive("/blood-need")
                    ? "navbar-dropdown-item-active"
                    : ""
                }`}
              >
                <Sparkles size={17} />
                <span>Need Blood?</span>
              </Link>
            </div>
          </div>

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

          {/* Authenticated navigation */}
          {user && (
            <>
              {navItem("/dashboard", "Dashboard", LayoutDashboard)}

              {/* {navItem("/assistant", "AI Chat", Activity)} */}

              {/* {navItem("/medicines", "My Medicines", Pill)} */}

              {/* {navItem("/doctors", "My Doctors", Stethoscope)} */}

              {/* =================================================
                  HEALTH DROPDOWN
                  Opens on hover
              ================================================== */}

              <div className="navbar-dropdown-wrapper">
                <button
                  type="button"
                  className={`nav-link ${
                    ishealthActive ? "nav-link-active" : ""
                  }`}
                >
                  <HeartPulse size={18} strokeWidth={2} />

                  <span>Health Overview</span>

                  <ChevronDown size={15} strokeWidth={2} />
                </button>

                <div className="navbar-dropdown">
                  <Link
                    to="/health"
                    onClick={handleNavigation}
                    className={`navbar-dropdown-item ${
                      isActive("/health") ? "navbar-dropdown-item-active" : ""
                    }`}
                  >
                    <Activity size={17} />
                    <span>Health Charts</span>
                  </Link>

                  <Link
                    to="/assistant"
                    onClick={handleNavigation}
                    className={`navbar-dropdown-item ${
                      isActive("/assistant")
                        ? "navbar-dropdown-item-active"
                        : ""
                    }`}
                  >
                    <Sparkles size={17} />
                    <span>AI Chat</span>
                  </Link>

                  <Link
                    to="/lifestyle"
                    onClick={handleNavigation}
                    className={`navbar-dropdown-item ${
                      isActive("/lifestyle")
                        ? "navbar-dropdown-item-active"
                        : ""
                    }`}
                  >
                    <Coffee size={17} />
                    <span>My Lifestyle</span>
                  </Link>
                </div>
              </div>

              {/* =================================================
                  DOCUMENTS DROPDOWN
                  Opens on hover
              ================================================== */}

              <div className="navbar-dropdown-wrapper">
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

                <div className="navbar-dropdown">
                  <Link
                    to="/medicines"
                    onClick={handleNavigation}
                    className={`navbar-dropdown-item ${
                      isActive("/medicines")
                        ? "navbar-dropdown-item-active"
                        : ""
                    }`}
                  >
                    <Pill size={17} />
                    <span>My Medicines</span>
                  </Link>

                  <Link
                    to="/doctors"
                    onClick={handleNavigation}
                    className={`navbar-dropdown-item ${
                      isActive("/doctors") ? "navbar-dropdown-item-active" : ""
                    }`}
                  >
                    <Stethoscope size={17} />
                    <span>My Doctors</span>
                  </Link>

                  <Link
                    to="/prescriptions"
                    onClick={handleNavigation}
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
                    onClick={handleNavigation}
                    className={`navbar-dropdown-item ${
                      isActive("/reports") ? "navbar-dropdown-item-active" : ""
                    }`}
                  >
                    <FileBarChart size={17} />
                    <span>My Reports</span>
                  </Link>
                </div>
              </div>

              {/* =================================================
                  ACCOUNT DROPDOWN
                  Opens on hover
              ================================================== */}

              <div className="navbar-dropdown-wrapper ml-2">
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

                <div className="navbar-dropdown navbar-dropdown-account">
                  <Link
                    to="/profile"
                    onClick={handleNavigation}
                    className={`navbar-dropdown-item ${
                      isActive("/profile") ? "navbar-dropdown-item-active" : ""
                    }`}
                  >
                    <UserRound size={17} />
                    <span>Profile</span>
                  </Link>

                  <Link
                    to="/settings"
                    onClick={handleNavigation}
                    className={`navbar-dropdown-item ${
                      isActive("/settings") ? "navbar-dropdown-item-active" : ""
                    }`}
                  >
                    <Settings size={17} />
                    <span>Settings</span>
                  </Link>

                  <div className="navbar-dropdown-divider" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="navbar-dropdown-item navbar-dropdown-danger"
                  >
                    <LogOut size={17} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* =====================================================
            MOBILE HEADER
        ====================================================== */}

        <div className="flex lg:hidden items-center gap-3">
          {user && (
            <span className="text-sm font-medium text-slate-700 truncate max-w-[140px]">
              Welcome, {username}
            </span>
          )}

          {!user ? (
            <>
              <Link to="/blood-need" className="nav-link">
                Need Blood?
              </Link>

              <Link to="/login" className="nav-link">
                Login
              </Link>

              <Link to="/signup" className="btn-primary">
                Sign Up
              </Link>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setMobileOpen((value) => !value)}
              className="navbar-mobile-toggle"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X size={22} strokeWidth={2} />
              ) : (
                <Menu size={22} strokeWidth={2} />
              )}
            </button>
          )}
        </div>
      </div>

      {/* =======================================================
          MOBILE MENU
      ======================================================== */}

      {mobileOpen && (
        <div className="navbar-mobile-menu lg:hidden">
          <nav className="container py-4">
            <div className="navbar-mobile-list">
              {navItem("/blood-need", "Need Blood?", Droplets)}

              {user ? (
                <>
                  {navItem("/dashboard", "Dashboard", LayoutDashboard)}

                  {navItem("/health", "Health Charts", Activity)}

                  {navItem("/assistant", "AI Chat", Sparkles)}

                  {navItem("/lifestyle", "Lifestyle Score", Coffee)}

                  {navItem("/medicines", "My Medicines", Pill)}

                  {navItem("/doctors", "My Doctors", Stethoscope)}

                  {navItem("/prescriptions", "My Prescriptions", FileImage)}

                  {navItem("/reports", "My Reports", FileBarChart)}

                  {navItem("/profile", "Profile", UserRound)}

                  {navItem("/settings", "Settings", Settings)}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="nav-link navbar-mobile-logout"
                  >
                    <LogOut size={18} strokeWidth={2} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={handleNavigation}
                    className="nav-link"
                  >
                    Login
                  </Link>

                  <Link
                    to="/signup"
                    onClick={handleNavigation}
                    className="nav-link"
                  >
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
