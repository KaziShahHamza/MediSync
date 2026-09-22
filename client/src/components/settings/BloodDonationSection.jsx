// client/src/components/settings/BloodDonationSection.jsx

// Renders the blood donation section within user settings.
// Manages donor status, contact info, last donation date, and honorarium preferences.

import ProfileSection from "../profile/ProfileSection";
import ProfileInput from "../profile/ProfileInput";
import ProfileSelect from "../profile/ProfileSelect";
import { months, years } from "../../data/settingsData";

// Renders blood donation profile settings and date selectors
export default function BloodDonationSection({
  form,
  onChange,
  onDonationDateChange,
}) {
  return (
    // Profile section container for blood donation settings
    <ProfileSection
      title="Blood Donation"
      description="Manage your blood donation availability and contact information."
    >
      {/* Container for donor status selection and contact number input */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* Dropdown for user blood donation availability */}
        <ProfileSelect
          label="Are you willing to donate blood?"
          name="bloodDonorStatus"
          value={form.bloodDonorStatus}
          onChange={onChange}
        >
          <option value="">Select</option>
          <option value="yes">Yes, I am available to donate</option>
          <option value="no">No, I do not want to donate</option>
          <option value="willingly">Willingly, when someone needs blood</option>
        </ProfileSelect>

        {/* Input field for public donor contact number */}
        <div>
          <ProfileInput
            label="Contact Number"
            type="tel"
            name="bloodDonationContactNumber"
            value={form.bloodDonationContactNumber}
            onChange={onChange}
            placeholder="e.g. 017XXXXXXXX"
          />

          {/* Privacy note for donor contact number */}
          <p className="text-sm text-slate-500 mt-2">
            This number will be shown in the blood donors page.
          </p>
        </div>
      </div>

      {/* Date controls for last blood donation */}
      <div className="mt-6">
        {/* Label for last blood donation inputs */}
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Last blood donation
        </label>

        {/* Container for month, year, and compensation select controls */}
        <div className="grid sm:grid-cols-2 gap-3 max-w-xl">
          {/* Dropdown selector for last donation month */}
          <select
            value={form.lastBloodDonation.month}
            onChange={(e) => onDonationDateChange("month", e.target.value)}
            className="input w-full"
          >
            <option value="">Select month</option>

            {/* Render month options dynamically */}
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>

          {/* Dropdown selector for last donation year */}
          <select
            value={form.lastBloodDonation.year}
            onChange={(e) => onDonationDateChange("year", e.target.value)}
            className="input w-full"
          >
            <option value="">Select year</option>

            {/* Render year options dynamically */}
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* Dropdown selector for travel cost/honorarium acceptance */}
          <ProfileSelect
            label="Accepts honorarium/travel cost? (সম্মানী/গাড়ি ভাড়া)"
            name="bloodDonationCompensation"
            value={form.bloodDonationCompensation}
            onChange={onChange}
            disabled={!["yes", "willingly"].includes(form.bloodDonorStatus)}
          >
            <option value="">Select</option>
            <option value="500">Yes</option>
            <option value="none">No</option>
          </ProfileSelect>
        </div>
      </div>
    </ProfileSection>
  );
}
