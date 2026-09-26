// client/src/components/home/HomeHero.jsx

// Renders the primary landing section for MediSync.
// Displays authentication-aware calls to action and a health overview preview.

import { Link } from "react-router-dom";
import { HeartPulse } from "lucide-react";

export default function HomeHero({ user }) {
  return (
    <section className="container page">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 px-4 py-2 rounded-full">
            <HeartPulse size={16} />
            Personal Healthcare Platform
          </p>

          <h1 className="mt-6 text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
            Manage your health
            <span className="text-blue-600"> with confidence</span>
          </h1>

          <p className="mt-6 text-lg text-slate-600 max-w-xl">
            MediSync helps you manage medicines, track health records, organize
            doctors, and keep your medical information available in one secure
            platform.
          </p>

          {/* Render actions according to the current authentication state. */}
          <div className="mt-8 flex flex-wrap gap-4">
            {!user && (
              <>
                <Link to="/signup" className="btn-primary">
                  Create Account
                </Link>

                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
              </>
            )}

            {user && (
              <Link to="/dashboard" className="btn-primary">
                Go To Dashboard
              </Link>
            )}
          </div>
        </div>

        {/* Render the primary health overview visual card. */}
        <div className="card min-h-[420px] flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-6">
              <HeartPulse size={42} className="text-blue-600" />
            </div>

            <h3 className="text-xl font-semibold text-slate-900">
              Complete Health Overview
            </h3>

            <p className="mt-2 text-slate-500 max-w-sm">
              A centralized place for your medicines, health records, and
              medical information.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
