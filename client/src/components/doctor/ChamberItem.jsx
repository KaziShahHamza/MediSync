// client/src/components/doctor/ChamberForm.jsx

// Manages the list of doctor chambers and handles chamber-level form updates.
// Delegates individual chamber rendering to ChamberItem.

import { Plus } from "lucide-react";

import {
  addChamber,
  removeChamber,
  selectChamberHospital,
  updateChamber,
  updateVisitingTime,
} from "../../utils/doctor/doctorFunctions";

import ChamberItem from "./ChamberItem";

export default function ChamberForm({ form, setForm, days }) {
  // Updates a specific field inside a chamber.
  const handleChange = (index, field, value) => {
    setForm((previousForm) => updateChamber(previousForm, index, field, value));
  };

  // Updates the selected hospital for a chamber.
  const handleHospitalChange = (index, value) => {
    setForm((previousForm) =>
      selectChamberHospital(previousForm, index, value),
    );
  };

  // Updates a specific visiting-time field.
  const handleTimeChange = (index, field, value) => {
    setForm((previousForm) =>
      updateVisitingTime(previousForm, index, field, value),
    );
  };

  // Adds a new chamber to the form.
  const handleAdd = () => {
    setForm((previousForm) => addChamber(previousForm));
  };

  // Removes a chamber from the form.
  const handleRemove = (index) => {
    setForm((previousForm) => removeChamber(previousForm, index));
  };

  return (
    // Chamber container: controls the repeated chamber layout.
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

      {/* Adds another empty chamber to the form. */}
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
