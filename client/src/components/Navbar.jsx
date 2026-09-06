// client/src/components/Navbar.jsx

import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  ChevronDown,
  FileBarChart,
  FileImage,
  LayoutDashboard,
  LogOut,
  Menu,
  Pill,
  Settings,
  Stethoscope,
  UserRound,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [documentsOpen, setDocumentsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const documentsRef = useRef(null);
  const accountRef = useRef(null);

  const username = user?.username || user?.name || "User";

  const isActive = (path) => location.pathname === path;

  const isDocumentsActive =
    location.pathname === "/prescriptions" ||
    location.pathname === "/reports";

  const isAccountActive =
    location.pathname === "/profile" ||
    location.pathname === "/settings";

  const handleLogout = () => {
    setMobileOpen(false);
    setAccountOpen(false);
    logout();
    navigate("/");
  };

  const handleNavigation = () => {
    setMobileOpen(false);
    setDocumentsOpen(false);
    setAccountOpen(false);
  };

  // Close desktop dropdowns when clicking outside.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        documentsRef.current &&
        !documentsRef.current.contains(event.target)
      ) {
        setDocumentsOpen(false);
      }

      if (
        accountRef.current &&
        !accountRef.current.contains(event.target)
      ) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close mobile menu when the route changes.
  useEffect(() => {
    setMobileOpen(false);
    setDocumentsOpen(false);
    setAccountOpen(false);
  }, [location.pathname]);

  const navItem = (path, label, Icon) => (
    <Link
      to={path}
      onClick={handleNavigation}
      className={`nav-link ${
        isActive(path) ? "nav-link-active" : ""
      }`}
    >
      <Icon size={18} strokeWidth={2} />
      <span>{label}</span>
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="container h-[72px] flex items-center justify-between gap-4">
        {/* Logo */}
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
        <div className="hidden lg:flex items-center gap-1">
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

          {user && (
            <>
              {navItem("/dashboard", "Dashboard", LayoutDashboard)}

              {navItem("/medicines", "My Medicines", Pill)}

              {navItem("/health", "Health Overview", Activity)}

              {navItem("/doctors", "My Doctors", Stethoscope)}

              {/* Documents dropdown */}
              <div className="relative" ref={documentsRef}>
                <button
                  type="button"
                  onClick={() => {
                    setDocumentsOpen((value) => !value);
                    setAccountOpen(false);
                  }}
                  className={`nav-link ${
                    isDocumentsActive ? "nav-link-active" : ""
                  }`}
                >
                  <FileImage size={18} strokeWidth={2} />

                  <span>Documents</span>

                  <ChevronDown
                    size={15}
                    strokeWidth={2}
                    className={`transition-transform duration-150 ${
                      documentsOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {documentsOpen && (
                  <div className="navbar-dropdown">
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
                        isActive("/reports")
                          ? "navbar-dropdown-item-active"
                          : ""
                      }`}
                    >
                      <FileBarChart size={17} />
                      <span>My Reports</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Account dropdown */}
              <div className="relative ml-2" ref={accountRef}>
                <button
                  type="button"
                  onClick={() => {
                    setAccountOpen((value) => !value);
                    setDocumentsOpen(false);
                  }}
                  className={`navbar-account ${
                    isAccountActive ? "navbar-account-active" : ""
                  }`}
                >
                  <UserRound size={18} strokeWidth={2} />

                  <span>
                    Welcome, {username}
                  </span>

                  <ChevronDown
                    size={15}
                    strokeWidth={2}
                    className={`transition-transform duration-150 ${
                      accountOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {accountOpen && (
                  <div className="navbar-dropdown navbar-dropdown-account">
                    <Link
                      to="/profile"
                      onClick={handleNavigation}
                      className={`navbar-dropdown-item ${
                        isActive("/profile")
                          ? "navbar-dropdown-item-active"
                          : ""
                      }`}
                    >
                      <UserRound size={17} />
                      <span>Profile</span>
                    </Link>

                    <Link
                      to="/settings"
                      onClick={handleNavigation}
                      className={`navbar-dropdown-item ${
                        isActive("/settings")
                          ? "navbar-dropdown-item-active"
                          : ""
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
                )}
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
              <Link
                to="/login"
                className="nav-link"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="btn-primary"
              >
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
      {user && mobileOpen && (
        <div className="navbar-mobile-menu lg:hidden">
          <nav className="container py-4">
            <div className="navbar-mobile-list">
              {navItem("/dashboard", "Dashboard", LayoutDashboard)}

              {navItem("/medicines", "My Medicines", Pill)}

              {navItem("/health", "Health Overview", Activity)}

              {navItem("/doctors", "My Doctors", Stethoscope)}

              {navItem(
                "/prescriptions",
                "My Prescriptions",
                FileImage
              )}

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
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}