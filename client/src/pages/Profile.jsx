// src/pages/Profile.jsx

import { useProfile } from "../context/ProfileContext";
import ProfileSummary from "../components/profile/ProfileSummary";
import EmergencyCardExport from "../components/profile/EmergencyCardExport";

export default function Profile() {
  const { profile, userInfo, loading } = useProfile();

  if (loading) {
    return (
      <div className="continer-profile-setting-page py-12">
        <div className="skeleton-card flex flex-col items-center justify-center space-y-3">
          <div className="skeleton-title" />
          <div className="skeleton-text max-w-xs" />
        </div>
      </div>
    );
  }

  return (
    <div className="continer-profile-setting-page py-10">
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>

        <p className="page-description">
          View your personal and medical information.
        </p>
      </div>

      <ProfileSummary
        userInfo={userInfo}
        profile={profile}
      />

      {/* <EmergencyCardExport
        userInfo={userInfo}
        profile={profile}
      /> */}
    </div>
  );
}