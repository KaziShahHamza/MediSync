// client/src/components/home/HomeFeatures.jsx

// Renders the homepage feature overview section.
// Defines the reusable feature metadata used by the feature cards.

import {
  Brain,
  FileText,
  HeartPulse,
  Pill,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

// Define the homepage features and their associated icons.
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

export default function HomeFeatures() {
  return (
    <section className="container section">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="page-title">
          Everything you need for better health management
        </h2>

        <p className="mt-4 text-slate-600">
          Organize your healthcare journey with powerful tools designed around
          your personal medical needs.
        </p>
      </div>

      {/* Render the responsive feature card grid. */}
      <div className="mt-10 grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {features.map((feature) => {
          // Resolve the configured icon component for each feature.
          const Icon = feature.icon;

          return (
            <div key={feature.title} className="card">
              <div className="icon-wrapper mb-5">
                <Icon size={22} className="text-blue-600" />
              </div>

              <h3 className="card-title">{feature.title}</h3>

              <p className="mt-3 text-slate-600">{feature.text}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
