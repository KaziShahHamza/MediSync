import ProfileSection from "../profile/ProfileSection";
import ProfileInput from "../profile/ProfileInput";
import { illnessOptions } from "../../data/settingsData";

export default function MedicalInfoSection({
  form,
  onChange,
  onToggleIllness,
}) {
  return (
    <ProfileSection
      title="Medical Information"
      description="Important medical history."
    >
      <label className="block text-sm font-medium mb-3">
        Chronic Illnesses
      </label>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
        {illnessOptions.map((item) => (
          <label
            key={item}
            className="flex items-center gap-2 rounded-lg border border-slate-200 p-3 hover:bg-slate-50 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={form.chronicIllnesses.includes(item)}
              onChange={() => onToggleIllness(item)}
              className="shrink-0 translate-y-px"
            />

            <span className="ml-2">{item}</span>
          </label>
        ))}
      </div>

      <div className="mt-5">
        <ProfileInput
          label="Allergies"
          name="allergies"
          placeholder="e.g., Dust, Cold, Egg, Fish"
          value={form.allergies}
          onChange={onChange}
        />
      </div>

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
