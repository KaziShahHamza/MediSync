// client/src/pages/Home.jsx

import { Link } from "react-router-dom";
import {
  Pill,
  HeartPulse,
  FileText,
  Stethoscope,
  Brain,
  ShieldCheck,
  Activity,
  Droplets,
  Scale,
  UserPlus,
  ClipboardPlus,
  TrendingUp,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  const features = [
    {
      title: "Medicine Management",
      text: "Store medicines, manage dosage schedules, and keep your treatment plan organized.",
      icon: Pill,
    },
    {
      title: "Health Tracking",
      text: "Monitor BMI, blood pressure, and blood sugar with clear health trends.",
      icon: HeartPulse,
    },
    {
      title: "Medical Records",
      text: "Keep prescriptions and important medical information organized securely.",
      icon: FileText,
    },
    {
      title: "Doctor Management",
      text: "Manage doctors, hospitals, specialties, and important contact details.",
      icon: Stethoscope,
    },
    {
      title: "Health Insights",
      text: "Understand your health progress with personalized summaries.",
      icon: Brain,
    },
    {
      title: "Secure Records",
      text: "Your health information stays private and connected to your account.",
      icon: ShieldCheck,
    },
  ];

  const steps = [
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

  return (
    <div className="ms-public-page">
      {/* ================= HERO ================= */}

      <section className="ms-public-hero">
        <div className="ms-container">
          <div className="ms-public-hero-grid">
            <div className="ms-public-hero-content">
              <div className="ms-public-eyebrow">
                <HeartPulse size={16} strokeWidth={2} aria-hidden="true" />

                <span>Personal Healthcare Platform</span>
              </div>

              <h1 className="ms-public-hero-title">
                Manage your health
                <span> with confidence</span>
              </h1>

              <p className="ms-public-hero-description">
                MediSync helps you manage medicines, track health records,
                organize doctors, and keep your medical information available in
                one secure platform.
              </p>

              <div className="ms-public-hero-actions">
                {!user && (
                  <>
                    <Link
                      to="/signup"
                      className="ms-btn ms-btn-primary ms-btn-lg"
                    >
                      Create Account
                    </Link>

                    <Link
                      to="/login"
                      className="ms-btn ms-btn-secondary ms-btn-lg"
                    >
                      Login
                    </Link>
                  </>
                )}

                {user && (
                  <Link
                    to="/dashboard"
                    className="ms-btn ms-btn-primary ms-btn-lg"
                  >
                    Go To Dashboard
                  </Link>
                )}
              </div>
            </div>

            <div className="ms-public-hero-visual">
              <div className="ms-public-placeholder">
                <div className="ms-public-placeholder-icon">
                  <HeartPulse size={42} strokeWidth={1.8} aria-hidden="true" />
                </div>

                <h2 className="ms-public-placeholder-title">
                  Complete Health Overview
                </h2>

                <p className="ms-public-placeholder-text">
                  A centralized place for your medicines, health records, and
                  medical information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}

      <section className="ms-section ms-public-section">
        <div className="ms-container">
          <div className="ms-public-section-heading">
            <h2 className="ms-page-title">
              Everything you need for better health management
            </h2>

            <p className="ms-public-section-description">
              Organize your healthcare journey with powerful tools designed
              around your personal medical needs.
            </p>
          </div>

          <div className="ms-grid ms-grid-3 ms-public-feature-grid">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="ms-card ms-card-interactive ms-public-feature-card"
                >
                  <div className="ms-public-icon">
                    <Icon size={22} strokeWidth={2} aria-hidden="true" />
                  </div>

                  <h3 className="ms-card-title">{feature.title}</h3>

                  <p className="ms-public-card-text">{feature.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}

      <section className="ms-public-muted-section">
        <div className="ms-container">
          <div className="ms-public-section-heading">
            <h2 className="ms-page-title">How MediSync works</h2>

            <p className="ms-public-section-description">
              Start organizing your health information in a few simple steps.
            </p>
          </div>

          <div className="ms-grid ms-grid-3 ms-public-step-grid">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.title}
                  className="ms-card ms-public-step-card"
                >
                  <div className="ms-public-step-top">
                    <div className="ms-public-icon">
                      <Icon size={22} strokeWidth={2} aria-hidden="true" />
                    </div>

                    <span className="ms-public-step-number">{step.number}</span>
                  </div>

                  <h3 className="ms-card-title">{step.title}</h3>

                  <p className="ms-public-card-text">{step.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= HEALTH MONITORING ================= */}

      <section className="ms-section ms-public-section">
        <div className="ms-container">
          <div className="ms-public-monitor-grid">
            <div className="ms-public-monitor-content">
              <h2 className="ms-page-title">Monitor your health trends</h2>

              <p className="ms-public-monitor-description">
                Track important health indicators over time. Historical records
                help you understand changes and make better decisions with your
                healthcare provider.
              </p>

              <div className="ms-public-metrics">
                <div className="ms-public-metric">
                  <Scale size={22} strokeWidth={2} aria-hidden="true" />

                  <p>BMI Tracking</p>
                </div>

                <div className="ms-public-metric">
                  <Activity size={22} strokeWidth={2} aria-hidden="true" />

                  <p>Blood Pressure</p>
                </div>

                <div className="ms-public-metric">
                  <Droplets size={22} strokeWidth={2} aria-hidden="true" />

                  <p>Blood Sugar</p>
                </div>
              </div>
            </div>

            <div className="ms-card ms-public-chart-placeholder">
              <Activity size={48} strokeWidth={1.7} aria-hidden="true" />

              <h3 className="ms-public-placeholder-title">Health Analytics</h3>

              <p className="ms-public-placeholder-text">
                Charts and health trends will appear here.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PRIVACY ================= */}

      <section className="ms-public-muted-section">
        <div className="ms-container">
          <div className="ms-public-privacy">
            <div className="ms-public-privacy-icon">
              <ShieldCheck size={42} strokeWidth={1.8} aria-hidden="true" />
            </div>

            <h2 className="ms-page-title">
              Your health data, organized securely
            </h2>

            <p>
              MediSync keeps your medical information organized and accessible
              while maintaining a secure personal healthcare environment.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CALL TO ACTION ================= */}

      {!user && (
        <section className="ms-public-cta">
          <div className="ms-container">
            <div className="ms-public-cta-content">
              <h2>Start managing your health today</h2>

              <p>
                Create your MediSync account and keep your healthcare
                information organized.
              </p>

              <Link to="/signup" className="ms-btn ms-btn-primary ms-btn-lg">
                Create Account
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
