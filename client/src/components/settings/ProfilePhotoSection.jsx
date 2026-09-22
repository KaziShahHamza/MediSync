// client/src/components/settings/ProfilePhotoSection.jsx

// Renders the profile photo management section in settings.
// Handles displaying current profile picture, initials placeholder, upload triggers, and deletion options.

import { Camera, Trash2, Upload } from "lucide-react";
import ProfileSection from "../profile/ProfileSection";
import { getInitials } from "../../utils/settings/settingsHelpers";

// Renders user profile photo upload and management controls
export default function ProfilePhotoSection({
  userInfo,
  photoLoading,
  fileInputRef,
  onPhotoSelect,
  onRemovePhoto,
}) {
  // Evaluates boolean condition to check if profile photo URL exists
  const hasPhoto = Boolean(userInfo?.profilePhotoUrl);

  return (
    // Profile section container for photo management
    <ProfileSection
      title="Profile Photo"
      description="Add a photo so your profile is easier to recognize."
    >
      {/* Flex container organizing preview display alongside action triggers */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        {/* Profile image preview or fallback initials container */}
        <div className="shrink-0">
          {hasPhoto ? (
            // Rendered user profile image when available
            <img
              src={userInfo.profilePhotoUrl}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
            />
          ) : (
            // Fallback avatar displaying computed name initials
            <div className="w-28 h-28 rounded-full bg-slate-100 border-4 border-white shadow-md flex items-center justify-center">
              <span className="text-3xl font-semibold text-slate-500">
                {getInitials(userInfo?.name)}
              </span>
            </div>
          )}
        </div>

        {/* Wrapper for photo action buttons and instructions */}
        <div className="space-y-3">
          {/* Group containing file selection and photo deletion buttons */}
          <div className="flex flex-wrap gap-3">
            {/* Action button to open hidden file input dialog */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={photoLoading}
              className="btn-primary flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {hasPhoto ? <Camera size={17} /> : <Upload size={17} />}

              {photoLoading
                ? "Processing..."
                : hasPhoto
                  ? "Change Photo"
                  : "Add Photo"}
            </button>

            {/* Conditionally rendered photo removal button */}
            {hasPhoto && (
              <button
                type="button"
                onClick={onRemovePhoto}
                disabled={photoLoading}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Trash2 size={17} />
                Remove Photo
              </button>
            )}
          </div>

          {/* Hidden HTML file input for uploading profile picture files */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={onPhotoSelect}
            className="hidden"
          />

          {/* Informational label for supported file formats and size constraints */}
          <p className="text-sm text-slate-500">
            JPG, PNG or WebP. Maximum file size: 5 MB.
          </p>
        </div>
      </div>
    </ProfileSection>
  );
}
