import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) =>
    location.pathname === path
      ? "text-sky-600 font-semibold border-b-2 border-sky-600"
      : "text-slate-600 hover:text-sky-600";

  return (
    <nav className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="w-full flex items-center justify-between py-4 px-10">
        <Link to="/" className="font-bold text-2xl text-sky-600">
          MediSync
        </Link>

        <div className="flex items-center gap-6">
          {!user && (
            <Link to="/login" className={isActive("/login")}>
              Login
            </Link>
          )}

          {user && (
            <>
              <Link to="/" className={isActive("/")}>
                Home
              </Link>

              <Link to="/dashboard" className={isActive("/dashboard")}>
                Dashboard
              </Link>

              <Link to="/medicines" className={isActive("/medicines")}>
                Medicines
              </Link>

              <Link to="/health" className={isActive("/health")}>
                Health Report
              </Link>

              <Link
                to="/prescriptions"
                className={isActive("/prescriptions")}
              >
                Prescriptions
              </Link>

              <Link
                to="/doctors"
                className={isActive("/doctors")}
              >
                Doctors
              </Link>

              <span className="ml-4 text-md text-slate-400">
                Welcome, {user.name || user.email}
              </span>

              <button
                onClick={handleLogout}
                className="ml-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}