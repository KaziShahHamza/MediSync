// src/pages/Profile.jsx

// Renders the user's profile information page.
// Displays loading feedback and the reusable profile summary component.

import { useProfile } from "../context/ProfileContext";

import ProfileSummary from "../components/profile/ProfileSummary";

// Provides the user's personal and medical profile view.
export default function Profile() {
  const { profile, userInfo, loading } = useProfile();

  // Displays the profile loading state.
  if (loading) {
    return (
      <div className="container-profile-setting-page py-12">
        <div className="skeleton-card flex flex-col items-center justify-center space-y-3">
          <div className="skeleton-title" />
          <div className="skeleton-text max-w-xs" />
        </div>
      </div>
    );
  }

  return (
    <div className="container-profile-setting-page py-10">
      {/* Displays profile page heading and description. */}
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>

        <p className="page-description">
          View your personal and medical information.
        </p>
      </div>

      {/* Displays the user's profile summary. */}
      <ProfileSummary userInfo={userInfo} profile={profile} />
    </div>
  );
}
