// client/src/components/navbar/Navbar.jsx

// Provides shared navbar utilities, authentication protection, branding, and layout.
// Coordinates desktop and mobile navigation behavior.

import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, Navigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import NavbarDesktop from "./NavbarDesktop";
import NavbarMobile from "./NavbarMobile";

// Resets the page scroll position whenever the route changes.
export function ScrollToTop() {
  const { pathname } = useLocation();

  // Synchronize window position with route navigation.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Restricts protected content to authenticated users.
export function ProtectedRoute({ children }) {
  const { user } = useAuth();

  return user ? children : <Navigate to="/login" replace />;
}

// Provides the shared wrapper used by navbar dropdown menus.
export function NavbarDropdown({ children, className = "" }) {
  return (
    <div className={`navbar-dropdown-wrapper ${className}`}>{children}</div>
  );
}

// Renders the application branding and home navigation link.
export function NavbarLogo({ onNavigation }) {
  return (
    <Link
      to="/"
      onClick={onNavigation}
      className="flex shrink-0 items-center gap-3"
    >
      <img
        src="/assets/icon_3.png"
        alt="MediSync"
        className="h-13 w-13 rounded-xl object-cover"
      />

      <div className="hidden sm:block">
        <h1 className="text-lg font-bold leading-tight text-slate-900">
          MediSync
        </h1>

        <p className="text-xs text-slate-500">Your Personal Health Platform</p>
      </div>

      <span className="text-lg font-bold text-slate-900 sm:hidden">
        MediSync
      </span>
    </Link>
  );
}

// Coordinates authentication state and responsive navbar behavior.
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Tracks whether the mobile navigation drawer is open.
  const [mobileOpen, setMobileOpen] = useState(false);

  // Resolves a safe display name for the authenticated user.
  const username = user?.username || user?.name || "User";

  // Closes the mobile navigation after route changes.
  const handleNavigation = () => {
    setMobileOpen(false);
  };

  // Clears the session and redirects the user to the home page.
  const handleLogout = () => {
    setMobileOpen(false);
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      {/* Main navigation row */}
      <div className="container flex h-[67px] items-center justify-between gap-4">
        {/* Application branding */}
        <NavbarLogo onNavigation={handleNavigation} />

        {/* Desktop navigation */}
        <NavbarDesktop
          user={user}
          username={username}
          onNavigation={handleNavigation}
          onLogout={handleLogout}
        />

        {/* Mobile header controls */}
        <NavbarMobile
          user={user}
          username={username}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          onLogout={handleLogout}
          headerOnly
        />
      </div>

      {/* Mobile navigation drawer */}
      <NavbarMobile
        user={user}
        username={username}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onLogout={handleLogout}
        drawerOnly
      />
    </header>
  );
}
