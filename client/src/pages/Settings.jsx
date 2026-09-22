// client/src/pages/Settings.jsx

// Main user Settings page component aggregating form sections and state actions.

import ProfileSection from "../components/profile/ProfileSection";

import ProfilePhotoSection from "../components/settings/ProfilePhotoSection";
import PersonalInfoSection from "../components/settings/PersonalInfoSection";
import MedicalInfoSection from "../components/settings/MedicalInfoSection";
import EmergencyContactsSection from "../components/settings/EmergencyContactsSection";
import BloodDonationSection from "../components/settings/BloodDonationSection";

import useSettingsForm from "../hooks/useSettingsForm";

// Renders the user profile settings page container
export default function Settings() {
  // Destructure custom hook state and management handlers
  const {
    profile,
    userInfo,
    loading,

    form,
    saving,
    photoLoading,

    fileInputRef,

    availableUpazilas,

    handleChange,
    handleHeightChange,
    handleLocationChange,
    toggleIllness,

    addEmergencyContact,
    removeEmergencyContact,
    handleEmergencyContactChange,

    handleDonationDateChange,

    handlePhotoSelect,
    handleRemovePhoto,

    handleSubmit,
  } = useSettingsForm();

  // Render loading feedback state
  if (loading) {
    return (
      <div className="continer-profile-setting-page py-12">
        <p className="text-center text-slate-500">Loading settings...</p>
      </div>
    );
  }

  // Render settings page layout and form controls
  return (
    <div className="continer-profile-setting-page py-10">
      {/* Page header title block */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-800">Settings</h1>

        <p className="text-slate-500 mt-2">
          Update your personal and medical information.
        </p>
      </div>

      {/* Main settings profile form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile photo management section */}
        <ProfilePhotoSection
          userInfo={userInfo}
          photoLoading={photoLoading}
          fileInputRef={fileInputRef}
          onPhotoSelect={handlePhotoSelect}
          onRemovePhoto={handleRemovePhoto}
        />

        {/* Personal details form inputs */}
        <PersonalInfoSection
          userInfo={userInfo}
          form={form}
          availableUpazilas={availableUpazilas}
          onChange={handleChange}
          onHeightChange={handleHeightChange}
          onLocationChange={handleLocationChange}
        />

        {/* Medical history form inputs */}
        <MedicalInfoSection
          form={form}
          onChange={handleChange}
          onToggleIllness={toggleIllness}
        />

        {/* Dynamic emergency contact inputs */}
        <EmergencyContactsSection
          form={form}
          onAdd={addEmergencyContact}
          onRemove={removeEmergencyContact}
          onChange={handleEmergencyContactChange}
        />

        {/* Blood donation status inputs */}
        <BloodDonationSection
          form={form}
          onChange={handleChange}
          onDonationDateChange={handleDonationDateChange}
        />

        {/* Form submit button wrapper */}
        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving
              ? "Saving..."
              : profile
                ? "Update Profile"
                : "Create Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
