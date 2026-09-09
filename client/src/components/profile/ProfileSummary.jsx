// src/components/profile/ProfileSummary.jsx

function InfoItem({ label, value, full = false }) {
  return (
    <div
      className={`
        surface-muted
        p-4
        ${full ? "md:col-span-2" : ""}
      `}
    >
      <p className="small-label uppercase tracking-wide">{label}</p>

      <p className="mt-2 font-medium break-words" style={{ color: "var(--color-text)" }}>
        {value || "-"}
      </p>
    </div>
  );
}

export default function ProfileSummary({ userInfo, profile }) {
  const height = profile?.height;

  const heightValue = height?.feet
    ? `${height.feet} ft ${height.inches || 0} in`
    : "-";

  const emergencyContact = profile?.emergencyContact;

  return (
    <div className="card w-full p-6 lg:p-8 bg-red-400">
      <div className="mb-8">
        <h2 className="card-title text-xl">Profile Summary</h2>

        <p className="text-sm text-muted mt-1">
          Overview of your saved personal and health information.
        </p>
      </div>

      {/* Personal Information */}
      <div className="mb-8">
        <h3 className="section-title text-lg mb-4">Personal Information</h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoItem label="Name" value={userInfo?.name} />
          <InfoItem label="Username" value={userInfo?.username} />
          <InfoItem label="Email" value={userInfo?.email} />
          <InfoItem
            label="Date of Birth"
            value={
              profile?.dob ? new Date(profile.dob).toLocaleDateString() : "-"
            }
          />
          <InfoItem label="Gender" value={profile?.gender} />
          <InfoItem label="Height" value={heightValue} />
          <InfoItem label="Blood Group" value={profile?.bloodGroup} />
        </div>
      </div>

      {/* Medical Information */}
      <div className="mb-8">
        <h3 className="section-title text-lg mb-4">Medical Information</h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 surface-muted p-4 border-l-4 border-l-[rgb(var(--color-accent))]">
            <p className="small-label uppercase tracking-wide">
              Chronic Illnesses
            </p>

            {profile?.chronicIllnesses?.length ? (
              <div className="flex flex-wrap gap-2 mt-3">
                {profile.chronicIllnesses.map((item) => (
                  <span key={item} className="badge">
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 subtitle">None</p>
            )}
          </div>

          <InfoItem
            label="Allergies"
            value={profile?.allergies || "None"}
            full
          />

          <InfoItem
            label="Previous Surgeries"
            value={profile?.surgeries || "None"}
            full
          />
        </div>
      </div>

      {/* Lifestyle */}
      <div className="mb-8">
        <h3 className="section-title text-lg mb-4">Lifestyle</h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoItem label="Smoking" value={profile?.smoking} />
          <InfoItem label="Alcohol" value={profile?.alcohol} />
          <InfoItem label="Exercise" value={profile?.exercise} />
          <InfoItem label="Diet" value={profile?.diet} />
        </div>
      </div>

      {/* Emergency Contact */}
      <div>
        <h3 className="section-title text-lg mb-4">Emergency Contact</h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <InfoItem label="Contact Name" value={emergencyContact?.name} />
          <InfoItem label="Phone Number" value={emergencyContact?.phone} />
        </div>
      </div>
    </div>
  );
}