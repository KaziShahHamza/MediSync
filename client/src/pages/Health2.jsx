import useHealthLogs from "../hooks/useHealthLogs";

import BMIForm from "../components/BMIForm";
import BMIChart from "../components/BMIChart";

import BloodPressureForm from "../components/BloodPressureForm";
import BloodPressureChart from "../components/BloodPressureChart";

import BloodSugarForm from "../components/BloodSugarForm";
import BloodSugarChart from "../components/BloodSugarChart";

export default function Health() {
  const { logs, addLog } = useHealthLogs();

  return (
    <div className="container py-8 space-y-10">
      <h2 className="text-3xl font-semibold">Health Report</h2>


        {/* Blood Pressure */}
      <div className="grid md:grid-cols-[30%_70%] gap-6">
        <BloodPressureForm onAdd={addLog} />
        <BloodPressureChart logs={logs} />
      </div>


    </div>
  );
}