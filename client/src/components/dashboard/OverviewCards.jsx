import {
  FaPills,
  FaWeight,
  FaHeartbeat,
  FaTint
} from "react-icons/fa";

export default function OverviewCards({
  healthLogs = []
}) {
  const getLatestLog = (type) => {
    const logs = healthLogs.filter(
      (log) => log.type === type
    );

    if (!logs.length) return null;

    return logs.sort(
      (a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    )[0];
  };

  const classifyBMI = (bmi) => {
    if (!bmi) return null;

    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";

    return "Obese";
  };

  const classifyBloodPressure = (high, low) => {
    if (!high || !low) return null;

    if (high < 120 && low < 80) {
      return "Normal";
    }

    if (high < 130 && low < 80) {
      return "Elevated";
    }

    return "High";
  };

  const classifyBloodSugar = (glucose) => {
    if (!glucose) return null;

    if (glucose < 100) {
      return "Normal";
    }

    if (glucose < 126) {
      return "Prediabetes";
    }

    return "High";
  };

  const latestBMI = getLatestLog("bmi");
  const latestBP = getLatestLog("bp");
  const latestSugar = getLatestLog("diabetes");

  const overviewCards = [
    {
      title: "Total Medicines",
      value: "—",
      status: null,
      icon: FaPills
    },
    {
      title: "Latest BMI",
      value: latestBMI?.bmi ?? "No record",
      status: classifyBMI(latestBMI?.bmi),
      icon: FaWeight
    },
    {
      title: "Blood Pressure",
      value:
        latestBP?.High && latestBP?.Low
          ? `${latestBP.High} / ${latestBP.Low}`
          : "No record",
      status: classifyBloodPressure(
        latestBP?.High,
        latestBP?.Low
      ),
      icon: FaHeartbeat
    },
    {
      title: "Blood Sugar",
      value: latestSugar?.glucose
        ? `${latestSugar.glucose} mg/dL`
        : "No record",
      status: classifyBloodSugar(
        latestSugar?.glucose
      ),
      icon: FaTint
    }
  ];

  return (
    <section
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
      aria-label="Health overview"
    >
      {overviewCards.map((card) => {
        const Icon = card.icon;

        return (
          <article
            key={card.title}
            className="card rounded-xl border shadow-sm p-5 min-h-[150px] flex flex-col justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl">
                <Icon aria-hidden="true" />
              </div>

              <h3 className="font-semibold">
                {card.title}
              </h3>
            </div>

            <div className="mt-4">
              <p className="text-2xl font-semibold">
                {card.value}
              </p>

              {card.status && (
                <span className="inline-block mt-2 text-sm px-3 py-1 rounded-full border">
                  {card.status}
                </span>
              )}
            </div>
          </article>
        );
      })}
    </section>
  );
}