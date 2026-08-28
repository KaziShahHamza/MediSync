// client/src/pages/TestReminderPage.jsx

const SLOT_LABEL = {
  morning: "Morning",
  noon: "Noon",
  night: "Night"
};

export default function TestReminderPage({ medicines }) {
  const triggerSlot = (slot) => {
    if (Notification.permission !== "granted") {
      alert("Notification permission not granted");
      return;
    }

    const medsForSlot = medicines
      .filter((med) => med.dosageTimes.includes(slot))
      .map((med) => med.name);

    if (medsForSlot.length === 0) {
      alert(`No ${slot} medicines found`);
      return;
    }

    new Notification("MediSync Reminder", {
      body: `Take your ${SLOT_LABEL[slot]} medicines: ${medsForSlot.join(", ")}`
    });
  };

  return (
    <div className="container py-8">
      <h2 className="text-2xl font-semibold mb-6">Test Notifications</h2>

      <div className="flex gap-4">
        {["morning", "noon", "night"].map((slot) => (
          <button
            key={slot}
            onClick={() => triggerSlot(slot)}
            className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition"
          >
            Trigger {SLOT_LABEL[slot]}
          </button>
        ))}
      </div>
    </div>
  );
}
