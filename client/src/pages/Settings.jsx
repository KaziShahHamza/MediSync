// client/src/pages/Settings.jsx

// Provides the complete profile and health settings interface.
// Connects reusable settings sections with the centralized settings form hook.

import ProfilePhotoSection from "../components/settings/ProfilePhotoSection";
import PersonalInfoSection from "../components/settings/PersonalInfoSection";
import MedicalInfoSection from "../components/settings/MedicalInfoSection";
import EmergencyContactsSection from "../components/settings/EmergencyContactsSection";
import BloodDonationSection from "../components/settings/BloodDonationSection";

import useSettingsForm from "../hooks/settings/useSettingsForm";

export default function Settings() {
  // Load settings data, form state, and section handlers.
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

  // Show a loading state until the profile data is available.
  if (loading) {
    return (
      <div className="container-profile-setting-page py-12">
        <p className="text-center text-slate-500">Loading settings...</p>
      </div>
    );
  }

  // Render all profile and health settings sections.
  return (
    <div className="container-profile-setting-page py-10">
      {/* Page heading */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-800">Settings</h1>

        <p className="mt-2 text-slate-500">
          Update your personal and medical information.
        </p>
      </div>

      {/* Main profile settings form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile photo settings */}
        <ProfilePhotoSection
          userInfo={userInfo}
          photoLoading={photoLoading}
          fileInputRef={fileInputRef}
          onPhotoSelect={handlePhotoSelect}
          onRemovePhoto={handleRemovePhoto}
        />

        {/* Personal information settings */}
        <PersonalInfoSection
          userInfo={userInfo}
          form={form}
          availableUpazilas={availableUpazilas}
          onChange={handleChange}
          onHeightChange={handleHeightChange}
          onLocationChange={handleLocationChange}
        />

        {/* Medical information settings */}
        <MedicalInfoSection
          form={form}
          onChange={handleChange}
          onToggleIllness={toggleIllness}
        />

        {/* Emergency contact settings */}
        <EmergencyContactsSection
          form={form}
          onAdd={addEmergencyContact}
          onRemove={removeEmergencyContact}
          onChange={handleEmergencyContactChange}
        />

        {/* Blood donation settings */}
        <BloodDonationSection
          form={form}
          onChange={handleChange}
          onDonationDateChange={handleDonationDateChange}
        />

        {/* Save profile changes */}
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
