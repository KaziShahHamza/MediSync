// src/pages/Profile.jsx

// src/pages/Profile.jsx

import { useProfile } from "../context/ProfileContext";
import ProfileSummary from "../components/profile/ProfileSummary";

export default function Profile() {
  const { profile, userInfo, loading } = useProfile();

  if (loading) {
    return (
      <div className="continer-profile-setting-page py-12">
        <p className="text-center text-slate-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="continer-profile-setting-page py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>

        <p className="text-slate-500 mt-2">
          View your personal and medical information.
        </p>
      </div>

      <ProfileSummary userInfo={userInfo} profile={profile} />
    </div>
  );
}
