// client/src/components/dashboard/DashboardNearbyServices.jsx

// Renders quick-access cards for nearby healthcare services.
// Opens Google Maps searches without requesting the user's location.

import { Ambulance, ArrowRight, Hospital, Pill } from "lucide-react";

import { openGoogleMapsSearch } from "../../utils/maps";

// Define the nearby healthcare services available from the dashboard.
const services = [
  {
    title: "Pharmacies Near Me",
    description: "Find nearby pharmacies and medicine stores",
    query: "pharmacy",
    icon: Pill,
  },
  {
    title: "Hospitals Near Me",
    description: "Find nearby hospitals and medical centers",
    query: "hospital",
    icon: Hospital,
  },
  {
    title: "Ambulances Near Me",
    description: "Find nearby ambulance services",
    query: "ambulance service",
    icon: Ambulance,
  },
];

// Render the nearby healthcare service shortcut section.
export default function DashboardNearbyServices() {
  return (
    <>
      <div className="section-header">
        <h2 className="section-title">Nearby Healthcare Services</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {services.map((service) => (
          <NearbyServiceCard key={service.query} {...service} />
        ))}
      </div>
    </>
  );
}

// Render an individual healthcare service card.
function NearbyServiceCard({ title, description, query, icon: Icon }) {
  // Open the corresponding Google Maps search when the card is clicked.
  const handleClick = () => {
    openGoogleMapsSearch(query);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="card group w-full text-left transition hover:border-blue-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="icon-wrapper">
          <Icon
            size={22}
            className="text-blue-600 transition-colors duration-150"
          />
        </div>

        <ArrowRight
          size={18}
          className="text-slate-400 transition-colors duration-150 group-hover:text-blue-600"
        />
      </div>

      <h3 className="mt-6 text-lg font-semibold text-slate-900 transition-colors duration-150 group-hover:text-blue-600">
        {title}
      </h3>

      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </button>
  );
}
