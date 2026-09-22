import { Camera, Trash2, Upload } from "lucide-react";
import ProfileSection from "../profile/ProfileSection";
import { getInitials } from "../../utils/settings/settingsHelpers";

export default function ProfilePhotoSection({
  userInfo,
  photoLoading,
  fileInputRef,
  onPhotoSelect,
  onRemovePhoto,
}) {
  const hasPhoto = Boolean(userInfo?.profilePhotoUrl);

  return (
    <ProfileSection
      title="Profile Photo"
      description="Add a photo so your profile is easier to recognize."
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="shrink-0">
          {hasPhoto ? (
            <img
              src={userInfo.profilePhotoUrl}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-slate-100 border-4 border-white shadow-md flex items-center justify-center">
              <span className="text-3xl font-semibold text-slate-500">
                {getInitials(userInfo?.name)}
              </span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-3">
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

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={onPhotoSelect}
            className="hidden"
          />

          <p className="text-sm text-slate-500">
            JPG, PNG or WebP. Maximum file size: 5 MB.
          </p>
        </div>
      </div>
    </ProfileSection>
  );
}
