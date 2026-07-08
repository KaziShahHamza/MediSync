import WelcomeCard from "../components/dashboard/WelcomeCard";
import DashboardClock from "../components/dashboard/DashboardClock";
import QuickActions from "../components/dashboard/QuickActions";

export default function Dashboard() {
  const placeholderSections = [
    {
      title: "Health Overview",
      description: "View your health metrics and important information."
    },
    {
      title: "Today's Medicines",
      description: "Keep track of your scheduled medications."
    },
    {
      title: "Recent Activity",
      description: "Review your recent health-related activities."
    },
    {
      title: "Health Summary",
      description: "Get a quick summary of your current health status."
    }
  ];

  return (
    <main className="container py-8 space-y-8">
      {/* Dashboard Header */}
      <header className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WelcomeCard />
        <DashboardClock />
      </header>

      {/* Quick Actions */}
      <section aria-labelledby="quick-actions-title">
        <h2
          id="quick-actions-title"
          className="text-xl font-semibold mb-4"
        >
          Quick Actions
        </h2>

        <QuickActions />
      </section>

      {/* Future Dashboard Sections */}
      <section
        aria-label="Dashboard information sections"
        className="space-y-6"
      >
        {placeholderSections.map((section) => (
          <article
            key={section.title}
            className="card p-6 min-h-[140px] flex flex-col justify-center"
          >
            <h2 className="text-xl font-semibold mb-2">
              {section.title}
            </h2>

            <p className="text-gray-600">
              {section.description}
            </p>
          </article>
        ))}
      </section>
    </main>
  );
}