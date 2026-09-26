// client/src/components/settings/PersonalInfoSection.jsx

// Renders personal profile settings and physical information.
// Manages identity fields, height, blood group, and dependent location selections.

import ProfileSection from "../profile/ProfileSection";
import ProfileInput from "../profile/ProfileInput";
import ProfileSelect from "../profile/ProfileSelect";
import { districtsData } from "../../data/districtsData";
import { bloodGroups } from "../../data/settingsData";

export default function PersonalInfoSection({
  userInfo,
  form,
  availableUpazilas,
  onChange,
  onHeightChange,
  onLocationChange,
}) {
  const hasDistrict = Boolean(form.location?.district);

  // Renders personal information and location controls.
  return (
    <ProfileSection
      title="Personal Information"
      description="Basic details used for your health profile."
    >
      {/* Main personal information fields */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        <ProfileInput
          label="Username"
          value={userInfo?.username || ""}
          disabled
        />

        <ProfileInput label="Email" value={userInfo?.email || ""} disabled />

        <ProfileInput
          label="Name"
          name="name"
          value={form.name}
          onChange={onChange}
        />

        <ProfileInput
          label="Date of Birth"
          type="date"
          name="dob"
          value={form.dob}
          onChange={onChange}
        />

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

        {/* Height measurement inputs */}
        <div>
          <label className="block text-sm font-medium mb-2">Height</label>

          <div className="flex gap-3">
            <input
              type="number"
              name="feet"
              placeholder="Feet"
              min="0"
              value={form.height.feet}
              onChange={onHeightChange}
              className="input w-full"
            />

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

        <ProfileSelect
          label="Blood Group"
          name="bloodGroup"
          value={form.bloodGroup}
          onChange={onChange}
        >
          {bloodGroups.map((group) => (
            <option key={group} value={group}>
              {group || "Select"}
            </option>
          ))}
        </ProfileSelect>

        {/* Private street address field */}
        <div className="md:col-span-2">
          <ProfileInput
            label="Street Address"
            name="streetAddress"
            value={form.location.streetAddress}
            onChange={(e) => onLocationChange("streetAddress", e.target.value)}
            placeholder="House/Road, Area, Village, etc."
          />

          <p className="text-xs text-slate-500 mt-2">
            Your street address is private and will only be used in your
            emergency card.
          </p>
        </div>

        {/* Dependent location selectors */}
        <ProfileSelect
          label="Upazila / Sub-district"
          value={form.location.upazila}
          onChange={(e) => onLocationChange("upazila", e.target.value)}
          disabled={!hasDistrict}
        >
          <option value="">
            {hasDistrict ? "Select upazila" : "Select district first"}
          </option>

          {availableUpazilas.map((upazila) => (
            <option key={upazila} value={upazila}>
              {upazila}
            </option>
          ))}
        </ProfileSelect>

        <ProfileSelect
          label="District / Zila"
          value={form.location.district}
          onChange={(e) => onLocationChange("district", e.target.value)}
        >
          <option value="">Select district</option>

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
