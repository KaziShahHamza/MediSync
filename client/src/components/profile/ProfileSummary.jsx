// src/components/profile/ProfileSummary.jsx

function InfoItem({ label, value, full = false }) {
  return (
    <div
      className={`
        rounded-xl
        border border-slate-200
        bg-slate-50
        p-4
        ${full ? "md:col-span-2" : ""}
      `}
    >
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>

      <p className="mt-2 font-medium text-slate-800 break-words">
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
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 lg:p-8">
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-slate-800">
          Profile Summary
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Overview of your saved personal and health information.
        </p>
      </div>

      {/* Personal Information */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Personal Information
        </h3>

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
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Medical Information
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2 rounded-xl bg-sky-50 border border-sky-100 p-4">
            <p className="text-xs uppercase tracking-wide text-sky-600">
              Chronic Illnesses
            </p>

            {profile?.chronicIllnesses?.length ? (
              <div className="flex flex-wrap gap-2 mt-3">
                {profile.chronicIllnesses.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-white border border-sky-200 px-3 py-1 text-sm text-slate-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-slate-600">None</p>
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
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Lifestyle</h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoItem label="Smoking" value={profile?.smoking} />

          <InfoItem label="Alcohol" value={profile?.alcohol} />

          <InfoItem label="Exercise" value={profile?.exercise} />

          <InfoItem label="Diet" value={profile?.diet} />
        </div>
      </div>

      {/* Emergency Contact */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Emergency Contact
        </h3>

        <div className="grid sm:grid-cols-2 gap-4">
          <InfoItem label="Contact Name" value={emergencyContact?.name} />

          <InfoItem label="Phone Number" value={emergencyContact?.phone} />
        </div>
      </div>
    </div>
  );
}
