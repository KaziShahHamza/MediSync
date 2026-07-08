// src/hooks/useMedicineReminder.js
import { useEffect } from "react";
import { TIME_MAP } from "../utils/timeMap";

const SLOT_LABEL = {
  morning: "Morning",
  noon: "Noon",
  night: "Night"
};

export default function useMedicineReminder(medicines) {

  useEffect(() => {
    if (Notification.permission !== "granted") return;

    const interval = setInterval(() => {
      const now = new Date().toTimeString().slice(0, 5);

      // find which slot matches current time
      const currentSlot = Object.keys(TIME_MAP).find(
        slot => TIME_MAP[slot] === now
      );

      if (!currentSlot) return;

      // collect medicines for this slot
      const medsForSlot = medicines
        .filter(med => med.dosageTimes.includes(currentSlot))
        .map(med => med.name);

      if (medsForSlot.length === 0) return;

      const medsList = medsForSlot.map(med => `• ${med}`).join("\n");

      new Notification("MediSync Reminder", {
        body: `Take your ${SLOT_LABEL[currentSlot]} medicines:\n${medsList}`
      });


    }, 60000);

    return () => clearInterval(interval);
  }, [medicines]);
}
