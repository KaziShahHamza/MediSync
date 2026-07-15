import { useEffect, useState } from "react";

export default function DashboardClock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const timezone =
    Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <section
      className="card p-6 flex flex-col justify-center"
      aria-label="Current date and time"
    >
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">
            Time
          </p>

          <h2 className="text-3xl font-semibold">
            {formattedTime}
          </h2>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Date
          </p>

          <p className="text-lg font-medium">
            {formattedDate}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Timezone
          </p>

          <p className="text-base font-medium">
            {timezone}
          </p>
        </div>
      </div>
    </section>
  );
}