import { useMedicines } from "../context/MedicineContext";

import WelcomeCard from "../components/dashboard2/WelcomeCard";
import DashboardClock from "../components/dashboard2/DashboardClock";
import QuickActions from "../components/dashboard2/QuickActions";
import OverviewCards from "../components/dashboard2/OverviewCards";
import TodayMedicines from "../components/dashboard2/TodayMedicines";

export default function Dashboard() {
  const { medicines } = useMedicines();

  const placeholderHealthLogs = [];

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

      {/* Health Overview */}
      <section aria-labelledby="health-overview-title">
        <h2
          id="health-overview-title"
          className="text-xl font-semibold mb-4"
        >
          Health Overview
        </h2>

        <OverviewCards
          healthLogs={placeholderHealthLogs}
          totalMedicines={medicines?.length || 0}
        />
      </section>

      {/* Today's Medicines */}
      <section aria-labelledby="today-medicines-title">
        <h2
          id="today-medicines-title"
          className="text-xl font-semibold mb-4"
        >
          Today's Medicines
        </h2>

        <TodayMedicines />
      </section>

      {/* Recent Activity Placeholder */}
      <section aria-labelledby="recent-activity-title">
        <article className="card rounded-xl border shadow-sm p-6 min-h-[140px] flex flex-col justify-center">
          <h2
            id="recent-activity-title"
            className="text-xl font-semibold mb-2"
          >
            Recent Activity
          </h2>

          <p className="text-gray-600">
            Your recent health activities will appear here.
          </p>
        </article>
      </section>

      {/* Health Summary Placeholder */}
      <section aria-labelledby="health-summary-title">
        <article className="card rounded-xl border shadow-sm p-6 min-h-[140px] flex flex-col justify-center">
          <h2
            id="health-summary-title"
            className="text-xl font-semibold mb-2"
          >
            Health Summary
          </h2>

          <p className="text-gray-600">
            A summary of your health information will appear here.
          </p>
        </article>
      </section>
    </main>
  );
}