// client/src/pages/Home.jsx

// Provides the public MediSync landing page.
// Combines reusable hero, feature, health, workflow, privacy, and CTA sections.

import { Link } from "react-router-dom";
import { ClipboardPlus, ShieldCheck, TrendingUp, UserPlus } from "lucide-react";

import { useAuth } from "../context/AuthContext";

import HomeHero from "../components/home/HomeHero";
import HomeFeatures from "../components/home/HomeFeatures";
import HomeHealthSection from "../components/home/HomeHealthSection";

const workflowSteps = [
  {
    number: "01",
    title: "Create Account",
    text: "Register and create your personal health profile.",
    icon: UserPlus,
  },
  {
    number: "02",
    title: "Add Health Data",
    text: "Manage medicines, doctors, prescriptions, and health records.",
    icon: ClipboardPlus,
  },
  {
    number: "03",
    title: "Track Progress",
    text: "Monitor your health journey through organized insights.",
    icon: TrendingUp,
  },
];

export default function Home() {
  // Determine whether the current visitor is authenticated.
  const { user } = useAuth();

  return (
    <div className="bg-white">
      {/* Hero section */}
      <HomeHero user={user} />

      {/* Feature overview */}
      <HomeFeatures />

      {/* How MediSync works */}
      <section className="bg-slate-50 py-16">
        <div className="container">
          <div className="text-center">
            <h2 className="page-title">How MediSync works</h2>

            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              Start organizing your health information in a few simple steps.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {workflowSteps.map((step) => {
              const Icon = step.icon;

              return (
                <div key={step.title} className="card">
                  {/* Step number and icon */}
                  <div className="flex items-center justify-between">
                    <div className="icon-wrapper">
                      <Icon size={22} className="text-blue-600" />
                    </div>

                    <span className="text-sm font-semibold text-slate-400">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="card-title mt-6">{step.title}</h3>

                  <p className="mt-3 text-slate-600">{step.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Health monitoring overview */}
      <HomeHealthSection />

      {/* Privacy information */}
      <section className="bg-slate-50 py-16">
        <div className="container text-center">
          <div className="mx-auto max-w-3xl">
            <ShieldCheck size={42} className="mx-auto text-blue-600" />

            <h2 className="page-title mt-5">
              Your health data, organized securely
            </h2>

            <p className="mt-4 text-slate-600">
              MediSync keeps your medical information organized and accessible
              while maintaining a secure personal healthcare environment.
            </p>
          </div>
        </div>
      </section>

      {/* Public visitor call to action */}
      {!user && (
        <section className="container py-20 text-center">
          <h2 className="text-4xl font-bold text-slate-900">
            Start managing your health today
          </h2>

          <p className="mt-4 text-slate-600">
            Create your MediSync account and keep your healthcare information
            organized.
          </p>

          <Link to="/signup" className="btn-primary mt-8 inline-flex">
            Create Account
          </Link>
        </section>
      )}
    </div>
  );
}
