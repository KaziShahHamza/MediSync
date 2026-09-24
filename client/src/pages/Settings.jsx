// client/src/pages/Settings.jsx

// Main Settings page for managing profile, medical, emergency, and donation information.

import ProfileSection from "../components/profile/ProfileSection";

import ProfilePhotoSection from "../components/settings/ProfilePhotoSection";
import PersonalInfoSection from "../components/settings/PersonalInfoSection";
import MedicalInfoSection from "../components/settings/MedicalInfoSection";
import EmergencyContactsSection from "../components/settings/EmergencyContactsSection";
import BloodDonationSection from "../components/settings/BloodDonationSection";

import useSettingsForm from "../hooks/settings/useSettingsForm";

export default function Settings() {
  // Get settings state and handlers from the custom hook.
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

  // Show loading state while profile data is being fetched.
  if (loading) {
    return (
      <div className="continer-profile-setting-page py-12">
        <p className="text-center text-slate-500">Loading settings...</p>
      </div>
    );
  }

  // Render the complete settings form.
  return (
    <div className="continer-profile-setting-page py-10">
      {/* Page heading */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-800">Settings</h1>

        <p className="text-slate-500 mt-2">
          Update your personal and medical information.
        </p>
      </div>

      {/* Main profile settings form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile photo section */}
        <ProfilePhotoSection
          userInfo={userInfo}
          photoLoading={photoLoading}
          fileInputRef={fileInputRef}
          onPhotoSelect={handlePhotoSelect}
          onRemovePhoto={handleRemovePhoto}
        />

        {/* Personal information section */}
        <PersonalInfoSection
          userInfo={userInfo}
          form={form}
          availableUpazilas={availableUpazilas}
          onChange={handleChange}
          onHeightChange={handleHeightChange}
          onLocationChange={handleLocationChange}
        />

        {/* Medical information section */}
        <MedicalInfoSection
          form={form}
          onChange={handleChange}
          onToggleIllness={toggleIllness}
        />

        {/* Emergency contacts section */}
        <EmergencyContactsSection
          form={form}
          onAdd={addEmergencyContact}
          onRemove={removeEmergencyContact}
          onChange={handleEmergencyContactChange}
        />

        {/* Blood donation section */}
        <BloodDonationSection
          form={form}
          onChange={handleChange}
          onDonationDateChange={handleDonationDateChange}
        />

        {/* Save profile button */}
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
