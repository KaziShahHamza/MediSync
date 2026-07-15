import { useNavigate } from "react-router-dom";
import {
  FaPills,
  FaHeartbeat,
  FaFileMedical,
  FaUserMd,
  FaUser,
  FaRobot
} from "react-icons/fa";

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Medicines",
      description: "Manage your daily medications",
      icon: FaPills,
      path: "/medicines",
      available: true
    },
    {
      title: "Health Report",
      description: "Track your health records",
      icon: FaHeartbeat,
      path: "/health",
      available: true
    },
    {
      title: "Medical Documents",
      description: "Store and manage medical files",
      icon: FaFileMedical,
      path: "/documents",
      available: false
    },
    {
      title: "Doctors",
      description: "Manage your healthcare providers",
      icon: FaUserMd,
      path: "/doctors",
      available: false
    },
    {
      title: "Profile",
      description: "Update your personal information",
      icon: FaUser,
      path: "/profile",
      available: true
    },
    {
      title: "AI Summary",
      description: "Get personalized health insights",
      icon: FaRobot,
      path: "/ai-summary",
      available: false
    }
  ];

  const handleNavigation = (action) => {
    if (action.available) {
      navigate(action.path);
    }
  };

  return (
    <nav
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      aria-label="Dashboard quick actions"
    >
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <button
            key={action.title}
            type="button"
            onClick={() => handleNavigation(action)}
            disabled={!action.available}
            className={`
              card p-5 text-left transition-all duration-150
              border rounded-xl shadow-sm
              focus:outline-none focus:ring-2 focus:ring-primary
              ${
                action.available
                  ? "hover:shadow-md hover:-translate-y-1 cursor-pointer"
                  : "opacity-60 cursor-not-allowed"
              }
            `}
            aria-label={action.title}
          >
            <div className="flex items-start gap-4">
              <div className="text-2xl mt-1">
                <Icon aria-hidden="true" />
              </div>

              <div>
                <h3 className="font-semibold text-lg">
                  {action.title}
                </h3>

                <p className="text-sm text-gray-600 mt-1">
                  {action.description}
                </p>

                {!action.available && (
                  <span className="text-xs text-gray-500 mt-2 block">
                    Not available yet
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </nav>
  );
}