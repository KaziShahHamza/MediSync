// client/src/pages/TestPage.jsx

import TestReminderPage from "./TestReminderPage";
import { useMedicines } from "../context/MedicineContext";

export default function TestPage() {
  const { medicines } = useMedicines();

  return (
    <div className="container py-8">
      <div className="card">
        <TestReminderPage medicines={medicines} />
      </div>
    </div>
  );
}
