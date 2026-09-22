import ProfileSection from "../profile/ProfileSection";
import ProfileInput from "../profile/ProfileInput";
import ProfileSelect from "../profile/ProfileSelect";
import { months, years } from "../../data/settingsData";

export default function BloodDonationSection({
  form,
  onChange,
  onDonationDateChange,
}) {
  return (
    <ProfileSection
      title="Blood Donation"
      description="Manage your blood donation availability and contact information."
    >
      <div className="grid md:grid-cols-2 gap-5">
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

        <div>
          <ProfileInput
            label="Contact Number"
            type="tel"
            name="bloodDonationContactNumber"
            value={form.bloodDonationContactNumber}
            onChange={onChange}
            placeholder="e.g. 017XXXXXXXX"
          />

          <p className="text-sm text-slate-500 mt-2">
            This number will be shown in the blood donors page.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Last blood donation
        </label>

        <div className="grid sm:grid-cols-2 gap-3 max-w-xl">
          <select
            value={form.lastBloodDonation.month}
            onChange={(e) => onDonationDateChange("month", e.target.value)}
            className="input w-full"
          >
            <option value="">Select month</option>

            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>

          <select
            value={form.lastBloodDonation.year}
            onChange={(e) => onDonationDateChange("year", e.target.value)}
            className="input w-full"
          >
            <option value="">Select year</option>

            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

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
