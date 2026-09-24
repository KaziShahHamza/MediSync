// Main navigation header component containing subcomponents for scroll management, routes, and dropdowns.

import { useState, useEffect } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  Navigate,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import NavbarDesktop from "./NavbarDesktop";
import NavbarMobile from "./NavbarMobile";

// Scrolls window to top automatically on route pathname changes
export function ScrollToTop() {
  const { pathname } = useLocation();

  // Triggers window scroll reset when route location updates
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Restricts child component rendering to authenticated users
export function ProtectedRoute({ children }) {
  const { user } = useAuth();

  return user ? children : <Navigate to="/login" />;
}

// Wrapper component to structure navbar dropdown elements
export function NavbarDropdown({
  children,
  className = "",
}) {
  return (
    <div className={`navbar-dropdown-wrapper ${className}`}>
      {children}
    </div>
  );
}

// Renders application branding logo link
export function NavbarLogo({ onNavigation }) {
  return (
    <Link
      to="/"
      onClick={onNavigation}
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
  );
}

// Top-level navigation bar assembling desktop and mobile views
export default function Navbar() {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);

  // Computes display name for current user session
  const username = user?.username || user?.name || "User";

  // Closes mobile menu overlay on route transition
  const handleNavigation = () => {
    setMobileOpen(false);
  };

  // Clears user session and redirects to home page
  const handleLogout = () => {
    setMobileOpen(false);
    logout();
    navigate("/");
  };

  // Renders sticky navigation header layout
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      {/* Main navbar row */}
      <div className="container h-[67px] flex items-center justify-between gap-4">
        {/* Navigation logo element */}
        <NavbarLogo onNavigation={handleNavigation} />

        {/* Desktop view navigation menu */}
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

      {/* Mobile drawer is outside the 67px navbar row */}
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

