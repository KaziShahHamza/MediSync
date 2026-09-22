import ProfileSection from "../components/profile/ProfileSection";

import ProfilePhotoSection from "../components/settings/ProfilePhotoSection";
import PersonalInfoSection from "../components/settings/PersonalInfoSection";
import MedicalInfoSection from "../components/settings/MedicalInfoSection";
import EmergencyContactsSection from "../components/settings/EmergencyContactsSection";
import BloodDonationSection from "../components/settings/BloodDonationSection";

import useSettingsForm from "../hooks/useSettingsForm";

export default function Settings() {
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

  if (loading) {
    return (
      <div className="continer-profile-setting-page py-12">
        <p className="text-center text-slate-500">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="continer-profile-setting-page py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-800">Settings</h1>

        <p className="text-slate-500 mt-2">
          Update your personal and medical information.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <ProfilePhotoSection
          userInfo={userInfo}
          photoLoading={photoLoading}
          fileInputRef={fileInputRef}
          onPhotoSelect={handlePhotoSelect}
          onRemovePhoto={handleRemovePhoto}
        />

        <PersonalInfoSection
          userInfo={userInfo}
          form={form}
          availableUpazilas={availableUpazilas}
          onChange={handleChange}
          onHeightChange={handleHeightChange}
          onLocationChange={handleLocationChange}
        />

        <MedicalInfoSection
          form={form}
          onChange={handleChange}
          onToggleIllness={toggleIllness}
        />

        <EmergencyContactsSection
          form={form}
          onAdd={addEmergencyContact}
          onRemove={removeEmergencyContact}
          onChange={handleEmergencyContactChange}
        />

        <BloodDonationSection
          form={form}
          onChange={handleChange}
          onDonationDateChange={handleDonationDateChange}
        />

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
