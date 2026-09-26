// client/src/components/doctor/ChamberForm.jsx

// Manages the doctor's chamber collection within the form.
// Delegates individual chamber rendering and field interactions to ChamberItem.

import { Plus } from "lucide-react";

import {
  addChamber,
  removeChamber,
  selectChamberHospital,
  updateChamber,
  updateVisitingTime,
} from "../../../utils/doctor/doctorFunctions";

import ChamberItem from "./ChamberItem";

export default function ChamberForm({ form, setForm, days }) {
  // Update a specific field inside a chamber.
  const handleChange = (index, field, value) => {
    setForm((previousForm) => updateChamber(previousForm, index, field, value));
  };

  // Update the selected hospital for a chamber.
  const handleHospitalChange = (index, value) => {
    setForm((previousForm) =>
      selectChamberHospital(previousForm, index, value),
    );
  };

  // Update a specific visiting-time field.
  const handleTimeChange = (index, field, value) => {
    setForm((previousForm) =>
      updateVisitingTime(previousForm, index, field, value),
    );
  };

  // Add a new chamber to the form.
  const handleAdd = () => {
    setForm((previousForm) => addChamber(previousForm));
  };

  // Remove the chamber at the specified index.
  const handleRemove = (index) => {
    setForm((previousForm) => removeChamber(previousForm, index));
  };

  // Render all chambers and the add-chamber action.
  return (
    <div className="space-y-4">
      {form.chambers.map((chamber, index) => (
        <ChamberItem
          key={`chamber-${index}`}
          chamber={chamber}
          index={index}
          total={form.chambers.length}
          days={days}
          onChange={handleChange}
          onHospitalChange={handleHospitalChange}
          onTimeChange={handleTimeChange}
          onRemove={handleRemove}
        />
      ))}

      <button
        type="button"
        onClick={handleAdd}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-blue-300 px-4 py-3 text-sm font-medium text-blue-600 transition hover:bg-blue-50"
      >
        <Plus size={17} />
        Add Another Chamber
      </button>
    </div>
  );
}
