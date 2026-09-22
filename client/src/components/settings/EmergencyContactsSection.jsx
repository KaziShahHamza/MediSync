import ProfileSection from "../profile/ProfileSection";
import ProfileInput from "../profile/ProfileInput";
import ProfileSelect from "../profile/ProfileSelect";
import { relationOptions } from "../../data/settingsData";

export default function EmergencyContactsSection({
  form,
  onAdd,
  onRemove,
  onChange,
}) {
  return (
    <ProfileSection
      title="Emergency Contacts"
      description="People who can be contacted when you need urgent support."
    >
      <div className="space-y-5">
        {form.emergencyContacts.map((contact, index) => (
          <div key={index} className="rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-slate-800">
                Emergency Contact {index + 1}
              </h3>

              <button
                type="button"
                onClick={() => onRemove(index)}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <ProfileSelect
                label="Relation"
                value={contact.relation}
                onChange={(e) => onChange(index, "relation", e.target.value)}
              >
                <option value="">Select relation</option>

                {relationOptions.map((relation) => (
                  <option key={relation} value={relation}>
                    {relation}
                  </option>
                ))}
              </ProfileSelect>

              <ProfileInput
                label="Name"
                value={contact.name}
                onChange={(e) => onChange(index, "name", e.target.value)}
              />

              <ProfileInput
                label="Phone Number"
                type="tel"
                value={contact.phone}
                onChange={(e) => onChange(index, "phone", e.target.value)}
              />

              <ProfileInput
                label="Email"
                type="email"
                value={contact.email}
                onChange={(e) => onChange(index, "email", e.target.value)}
              />
            </div>
          </div>
        ))}

        {form.emergencyContacts.length < 3 && (
          <button type="button" onClick={onAdd} className="btn-primary">
            + Add Emergency Contact
          </button>
        )}

        <p className="text-sm text-slate-500">
          You can add up to 3 emergency contacts. Each contact must have a phone
          number or email address.
        </p>
      </div>
    </ProfileSection>
  );
}
