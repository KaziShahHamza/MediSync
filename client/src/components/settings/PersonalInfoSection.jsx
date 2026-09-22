// client/src/components/settings/PersonalInfoSection.jsx

// Renders personal information settings form inputs.
// Manages identity details, physical traits, blood group, and address/location hierarchy.

import ProfileSection from "../profile/ProfileSection";
import ProfileInput from "../profile/ProfileInput";
import ProfileSelect from "../profile/ProfileSelect";
import { districtsData } from "../../data/districtsData";
import { bloodGroups } from "../../data/settingsData";

// Renders input fields for personal profile metadata
export default function PersonalInfoSection({
  userInfo,
  form,
  availableUpazilas,
  onChange,
  onHeightChange,
  onLocationChange,
}) {
  return (
    // Profile section container for personal background details
    <ProfileSection
      title="Personal Information"
      description="Basic details used for your health profile."
    >
      {/* Grid container arranging personal details form fields */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {/* Read-only field displaying assigned username */}
        <ProfileInput
          label="Username"
          value={userInfo?.username || ""}
          disabled
        />

        {/* Read-only field displaying account email */}
        <ProfileInput label="Email" value={userInfo?.email || ""} disabled />

        {/* Editable input field for user's full name */}
        <ProfileInput
          label="Name"
          value={form.name}
          name="name"
          onChange={onChange}
        />

        {/* Date picker input for birth date */}
        <ProfileInput
          label="Date of Birth"
          type="date"
          name="dob"
          value={form.dob}
          onChange={onChange}
        />

        {/* Dropdown selector for user gender identification */}
        <ProfileSelect
          label="Gender"
          name="gender"
          value={form.gender}
          onChange={onChange}
        >
          <option value="">Select</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </ProfileSelect>

        {/* Multi-input group for height measurement */}
        <div>
          {/* Form label for height input group */}
          <label className="block text-sm font-medium mb-2">Height</label>

          {/* Flexbox layout for imperial height controls */}
          <div className="flex gap-3">
            {/* Number input for height feet measurement */}
            <input
              type="number"
              name="feet"
              placeholder="Feet"
              min="0"
              value={form.height.feet}
              onChange={onHeightChange}
              className="input w-full"
            />

            {/* Number input for height inches measurement */}
            <input
              type="number"
              name="inches"
              placeholder="Inches"
              min="0"
              max="11"
              value={form.height.inches}
              onChange={onHeightChange}
              className="input w-full"
            />
          </div>
        </div>

        {/* Select dropdown for user blood group type */}
        <ProfileSelect
          label="Blood Group"
          name="bloodGroup"
          value={form.bloodGroup}
          onChange={onChange}
        >
          {/* Dynamic rendering of valid blood type choices */}
          {bloodGroups.map((group) => (
            <option key={group} value={group}>
              {group || "Select"}
            </option>
          ))}
        </ProfileSelect>

        {/* Input container for street-level residential address */}
        <div className="col-span-2">
          <ProfileInput
            label="Street Address"
            name="streetAddress"
            value={form.location.streetAddress}
            onChange={(e) => onLocationChange("streetAddress", e.target.value)}
            placeholder="House/Road, Area, Village, etc."
          />

          {/* Context note regarding address privacy scope */}
          <p className="text-xs text-slate-500 mt-2">
            Your street address is private and will only be used in your
            emergency card.
          </p>
        </div>

        {/* Dependent dropdown selector for sub-district area */}
        <ProfileSelect
          label="Upazila / Sub-district"
          value={form.location.upazila}
          onChange={(e) => onLocationChange("upazila", e.target.value)}
          disabled={!form.location.district}
        >
          <option value="">
            {form.location.district
              ? "Select upazila"
              : "Select district first"}
          </option>

          {/* Dynamic rendering of available upazila locations */}
          {availableUpazilas.map((upazila) => (
            <option key={upazila} value={upazila}>
              {upazila}
            </option>
          ))}
        </ProfileSelect>

        {/* Dropdown selector for district location */}
        <ProfileSelect
          label="District / Zila"
          value={form.location.district}
          onChange={(e) => onLocationChange("district", e.target.value)}
        >
          <option value="">Select district</option>

          {/* Dynamic list rendering of districts */}
          {districtsData.map((district) => (
            <option key={district.name} value={district.name}>
              {district.name}
            </option>
          ))}
        </ProfileSelect>
      </div>
    </ProfileSection>
  );
}
