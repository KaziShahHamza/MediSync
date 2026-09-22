// client/src/components/settings/EmergencyContactsSection.jsx

// Renders the emergency contacts section in user settings.
// Allows users to dynamically add, edit, and remove up to 3 emergency contacts.

import ProfileSection from "../profile/ProfileSection";
import ProfileInput from "../profile/ProfileInput";
import ProfileSelect from "../profile/ProfileSelect";
import { relationOptions } from "../../data/settingsData";

// Renders emergency contacts form and list management UI
export default function EmergencyContactsSection({
  form,
  onAdd,
  onRemove,
  onChange,
}) {
  return (
    // Profile section container for emergency contact management
    <ProfileSection
      title="Emergency Contacts"
      description="People who can be contacted when you need urgent support."
    >
      {/* List wrapper for emergency contact cards */}
      <div className="space-y-5">
        {/* Dynamic mapping of stored emergency contacts */}
        {form.emergencyContacts.map((contact, index) => (
          // Contact card container for individual emergency contact
          <div key={index} className="rounded-xl border border-slate-200 p-5">
            {/* Header row containing contact index and remove trigger */}
            <div className="flex items-center justify-between mb-5">
              {/* Dynamic title display for contact item number */}
              <h3 className="font-semibold text-slate-800">
                Emergency Contact {index + 1}
              </h3>

              {/* Action button to remove current contact card */}
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>

            {/* Input grid for individual contact details */}
            <div className="grid md:grid-cols-2 gap-5">
              {/* Dropdown selector for relationship type */}
              <ProfileSelect
                label="Relation"
                value={contact.relation}
                onChange={(e) => onChange(index, "relation", e.target.value)}
              >
                <option value="">Select relation</option>

                {/* Dynamic rendering of relation options */}
                {relationOptions.map((relation) => (
                  <option key={relation} value={relation}>
                    {relation}
                  </option>
                ))}
              </ProfileSelect>

              {/* Input for contact full name */}
              <ProfileInput
                label="Name"
                value={contact.name}
                onChange={(e) => onChange(index, "name", e.target.value)}
              />

              {/* Input for contact phone number */}
              <ProfileInput
                label="Phone Number"
                type="tel"
                value={contact.phone}
                onChange={(e) => onChange(index, "phone", e.target.value)}
              />

              {/* Input for contact email address */}
              <ProfileInput
                label="Email"
                type="email"
                value={contact.email}
                onChange={(e) => onChange(index, "email", e.target.value)}
              />
            </div>
          </div>
        ))}

        {/* Action button to add new contact up to maximum threshold */}
        {form.emergencyContacts.length < 3 && (
          <button type="button" onClick={onAdd} className="btn-primary">
            + Add Emergency Contact
          </button>
        )}

        {/* Informational note regarding contact constraints */}
        <p className="text-sm text-slate-500">
          You can add up to 3 emergency contacts. Each contact must have a phone
          number or email address.
        </p>
      </div>
    </ProfileSection>
  );
}
