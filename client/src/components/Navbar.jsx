import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Pill,
  HeartPulse,
  FileImage,
  Stethoscope,
  UserRound,
  LogOut,
  ShieldCheck,
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


  const isActive = (path) => 
    location.pathname === path;


  const navItem = (path, label, Icon) => (

    <Link
      to={path}
      className={`nav-link ${
        isActive(path)
          ? "nav-link-active"
          : ""
      }`}
    >

      <Icon
        size={18}
        strokeWidth={2}
      />

      <span>
        {label}
      </span>

    </Link>

  );


  return (

    <header
      className="
        sticky
        top-0
        z-50
        bg-white
        border-b
        border-slate-200
        shadow-sm
      "
    >

      <div
        className="
          container
          h-[72px]
          flex
          items-center
          justify-between
        "
      >


        {/* Logo */}

        <Link
          to={user ? "/" : "/"}
          className="
            flex
            items-center
            gap-3
          "
        >

          <div
            className="
              w-10
              h-10
              rounded-xl
              bg-blue-600
              flex
              items-center
              justify-center
            "
          >

            <ShieldCheck
              size={22}
              className="text-white"
            />

          </div>


          <div>

            <h1
              className="
                text-lg
                font-bold
                text-slate-900
                leading-tight
              "
            >
              MediSync
            </h1>


            <p
              className="
                text-xs
                text-slate-500
              "
            >
              Personal Health Platform
            </p>

          </div>

        </Link>




        {/* Navigation */}

        <div
          className="
            flex
            items-center
            gap-2
          "
        >


          {!user && (

            <>

              <Link
                to="/login"
                className={`
                  nav-link
                  ${
                    isActive("/login")
                      ? "nav-link-active"
                      : ""
                  }
                `}
              >

                Login

              </Link>


              <Link
                to="/signup"
                className="
                  btn-primary
                "
              >

                Create Account

              </Link>

            </>

          )}




          {user && (

            <>


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
                className="
                  h-8
                  w-px
                  bg-slate-200
                  mx-2
                "
              />



              <div
                className="
                  hidden
                  xl:flex
                  flex-col
                  mr-2
                "
              >

                <span
                  className="
                    text-sm
                    font-medium
                    text-slate-800
                  "
                >

                  {user.name || "User"}

                </span>


                <span
                  className="
                    text-xs
                    text-slate-500
                  "
                >

                  {user.email}

                </span>

              </div>



              <button
                onClick={handleLogout}
                className="
                  btn-danger
                "
              >

                <LogOut
                  size={18}
                  strokeWidth={2}
                />


                Logout

              </button>


            </>

          )}

        </div>

      </div>

    </header>

  );

}