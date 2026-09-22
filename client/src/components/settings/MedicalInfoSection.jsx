// client/src/components/settings/MedicalInfoSection.jsx

// Renders the medical info settings section.
// Handles selections for chronic conditions, allergies, and surgical histories.

import ProfileSection from "../profile/ProfileSection";
import ProfileInput from "../profile/ProfileInput";
import { illnessOptions } from "../../data/settingsData";

// Renders controls for user medical background inputs
export default function MedicalInfoSection({
  form,
  onChange,
  onToggleIllness,
}) {
  return (
    // Profile section container for medical records
    <ProfileSection
      title="Medical Information"
      description="Important medical history."
    >
      {/* Label for chronic illness selection group */}
      <label className="block text-sm font-medium mb-3">
        Chronic Illnesses
      </label>

      {/* Grid container for chronic illness checkboxes */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
        {/* Map through common illness options to generate checkbox controls */}
        {illnessOptions.map((item) => (
          <label
            key={item}
            className="flex items-center gap-2 rounded-lg border border-slate-200 p-3 hover:bg-slate-50 cursor-pointer"
          >
            {/* Checkbox input for individual chronic illness toggle */}
            <input
              type="checkbox"
              checked={form.chronicIllnesses.includes(item)}
              onChange={() => onToggleIllness(item)}
              className="shrink-0 translate-y-px"
            />

            {/* Label text displaying illness name */}
            <span className="ml-2">{item}</span>
          </label>
        ))}
      </div>

      {/* Input container for user allergies */}
      <div className="mt-5">
        <ProfileInput
          label="Allergies"
          name="allergies"
          placeholder="e.g., Dust, Cold, Egg, Fish"
          value={form.allergies}
          onChange={onChange}
        />
      </div>

      {/* Input container for past surgery history */}
      <div className="mt-5">
        <ProfileInput
          label="Surgeries"
          name="surgeries"
          placeholder="e.g., Heart surgery (2020), Eye operation (2024)"
          value={form.surgeries}
          onChange={onChange}
        />
      </div>
    </ProfileSection>
  );
}
