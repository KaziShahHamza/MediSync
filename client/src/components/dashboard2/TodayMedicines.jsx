import { FaClock, FaPills } from "react-icons/fa";
import { useMedicines } from "../../context/MedicineContext";
import { useNavigate } from "react-router-dom";

export default function TodayMedicines() {
  const { medicines = [], loading } = useMedicines();
  const navigate = useNavigate();

  const medicineGroups = {
    Morning: "morning",
    Noon: "noon",
    Night: "night"
  };

  const groupedMedicines = Object.entries(medicineGroups).reduce(
    (groups, [label, time]) => {
      groups[label] = medicines
        .filter((medicine) =>
          medicine.dosageTimes?.includes(time)
        )
        .sort((a, b) =>
          a.name.localeCompare(b.name)
        );

      return groups;
    },
    {}
  );

  if (loading) {
    return (
      <section
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        aria-label="Loading medicines"
      >
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="card rounded-xl border shadow-sm p-5 animate-pulse"
          >
            <div className="h-5 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        ))}
      </section>
    );
  }

  if (!medicines.length) {
    return (
      <section
        className="card rounded-xl border shadow-sm p-6 text-center"
        aria-label="No medicines"
      >
        <FaPills className="text-3xl mx-auto mb-3" />

        <h3 className="text-lg font-semibold">
          No medicines scheduled today.
        </h3>

        <p className="text-gray-600 mt-2 mb-4">
          Add your medicines to keep track of your daily schedule.
        </p>

        <button
          type="button"
          className="btn-primary"
          onClick={() => navigate("/medicines")}
        >
          Add Medicines
        </button>
      </section>
    );
  }

  return (
    <section
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
      aria-label="Today's medicines"
    >
      {Object.entries(groupedMedicines).map(
        ([groupName, groupMedicines]) => (
          <article
            key={groupName}
            className="card rounded-xl border shadow-sm p-5 min-h-[220px]"
          >
            <header className="flex items-center gap-3 mb-4">
              <FaClock aria-hidden="true" />

              <h3 className="text-lg font-semibold">
                {groupName}
              </h3>
            </header>

            {groupMedicines.length === 0 ? (
              <p className="text-gray-600">
                No medicines scheduled.
              </p>
            ) : (
              <ul className="space-y-3">
                {groupMedicines.map((medicine) => (
                  <li
                    key={medicine._id}
                    className="border rounded-lg p-3"
                  >
                    <p className="font-medium">
                      {medicine.name}
                    </p>

                    <p className="text-sm text-gray-600">
                      Dosage: Daily
                    </p>

                    <p className="text-sm text-gray-600 capitalize">
                      Time: {groupName}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </article>
        )
      )}
    </section>
  );
}