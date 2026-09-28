// client/src/components/navbar/NavbarMobile.jsx

// Renders responsive mobile navigation controls and the navigation drawer.
// Separates the compact header controls from the full mobile menu.

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

// Renders mobile header controls or the expanded navigation drawer.
export default function NavbarMobile({
  user,
  username,
  mobileOpen,
  setMobileOpen,
  onLogout,
  headerOnly = false,
  drawerOnly = false,
}) {
  // Closes the mobile drawer after selecting a navigation route.
  const handleNavigation = () => {
    setMobileOpen(false);
  };

  // Creates a reusable mobile navigation link.
  const navItem = (path, label, Icon) => (
    <Link to={path} onClick={handleNavigation} className="nav-link">
      <Icon size={18} strokeWidth={2} />
      <span>{label}</span>
    </Link>
  );

  // Renders the compact controls inside the main navbar row.
  if (headerOnly) {
    return (
      <div className="flex items-center gap-3 lg:hidden">
        {/* Authenticated user greeting */}
        {user && (
          <span className="max-w-[140px] truncate text-sm font-medium text-slate-700">
            Welcome, {username}
          </span>
        )}

        {!user ? (
          <>
            {/* Public blood navigation */}
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
          /* Mobile drawer toggle */
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

  // Renders the expanded mobile navigation drawer.
  if (drawerOnly) {
    return (
      <>
        {mobileOpen && (
          <div className="navbar-mobile-menu lg:hidden">
            <nav className="container py-4">
              {/* Mobile navigation route collection */}
              <div className="navbar-mobile-list">
                {navItem("/blood-search", "Find Donor", Droplets)}
                {navItem("/blood-request", "Post Blood Request", Sparkles)}

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

                    {/* Mobile logout action */}
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
                    {/* Public authentication routes */}
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
