// server/services/reminderScheduler.js
import cron from "node-cron";
import Medicine from "../models/Medicine.js";

const TIME_MAP = {
  morning: "10:00",
  noon: "13:00",
  night: "20:00"
};

export function startReminderScheduler() {
  cron.schedule("* * * * *", async () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);

    const medicines = await Medicine.find({ active: true });

    medicines.forEach(med => {
      med.dosageTimes.forEach(time => {
        if (TIME_MAP[time] === currentTime) {
          console.log(`REMINDER: Take ${med.name}`);
        }
      });
    });
  });
}
