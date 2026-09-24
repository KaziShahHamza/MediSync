
// Mobile navigation header component handling mobile action buttons and responsive drawer state.

import { Link } from "react-router-dom";
import {
  Activity,
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
  Sparkles,
  Coffee,
  X,
} from "lucide-react";

// Mobile view container with drawer toggle and expandable navigation list
export default function NavbarMobile({
  user,
  username,
  mobileOpen,
  setMobileOpen,
  onLogout,
  headerOnly = false,
  drawerOnly = false,
}) {
  // Closes mobile menu drawer on navigation selection
  const handleNavigation = () => {
    setMobileOpen(false);
  };

  // Helper component to render menu navigation links
  const navItem = (path, label, Icon) => (
    <Link
      to={path}
      onClick={handleNavigation}
      className="nav-link"
    >
      <Icon size={18} strokeWidth={2} />
      <span>{label}</span>
    </Link>
  );

  // Render only the mobile header controls
  if (headerOnly) {
    return (
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
    );
  }

  // Render only the mobile drawer
  if (drawerOnly) {
    return (
      <>
        {mobileOpen && (
          <div className="navbar-mobile-menu lg:hidden">
            <nav className="container py-4">
              <div className="navbar-mobile-list">
                {navItem("/blood-need", "Need Blood?", Droplets)}

                {user ? (
                  <>
                    {navItem(
                      "/dashboard",
                      "Dashboard",
                      LayoutDashboard
                    )}

                    {navItem(
                      "/health",
                      "Health Charts",
                      Activity
                    )}

                    {navItem(
                      "/assistant",
                      "AI Chat",
                      Sparkles
                    )}

                    {navItem(
                      "/lifestyle",
                      "Lifestyle Score",
                      Coffee
                    )}

                    {navItem(
                      "/medicines",
                      "My Medicines",
                      Pill
                    )}

                    {navItem(
                      "/doctors",
                      "My Doctors",
                      Stethoscope
                    )}

                    {navItem(
                      "/prescriptions",
                      "My Prescriptions",
                      FileImage
                    )}

                    {navItem(
                      "/reports",
                      "My Reports",
                      FileBarChart
                    )}

                    {navItem(
                      "/profile",
                      "Profile",
                      UserRound
                    )}

                    {navItem(
                      "/settings",
                      "Settings",
                      Settings
                    )}

                    <button
                      type="button"
                      onClick={onLogout}
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
      </>
    );
  }

  return null;
}

