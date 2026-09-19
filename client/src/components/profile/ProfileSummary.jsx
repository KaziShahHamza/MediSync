// client/src/components/profile/ProfileSummary.jsx

import EmergencyCardExport from "./EmergencyCardExport";

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

      <p
        className="mt-2 font-medium break-words"
        style={{ color: "var(--color-text)" }}
      >
        {value || "-"}
      </p>
    </div>
  );
}

function formatDonationDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatDonorStatus(value) {
  switch (value) {
    case "yes":
      return "Yes, available to donate";

    case "willingly":
      return "Willingly, when someone needs blood";

    case "no":
      return "No";

    default:
      return "-";
  }
}

function formatCompensation(value) {
  switch (value) {
    case "500":
      return "Yes";

    case "1000":
      return "1000 Tk";

    case "none":
      return "No";

    default:
      return "-";
  }
}

function formatLocation(location) {
  if (!location) return "-";

  return (
    [location.streetAddress, location.upazila, location.district]
      .filter(Boolean)
      .join(", ") || "-"
  );
}

export default function ProfileSummary({ userInfo, profile }) {
  const height = profile?.height;

  const heightValue = height?.feet
    ? `${height.feet} ft ${height.inches || 0} in`
    : "-";

  const emergencyContacts = profile?.emergencyContacts || [];

  const location = profile?.location || {};

  return (
    <div className="card w-full p-6 lg:p-8">
      <div className="mb-8">
        <h2 className="card-title text-xl">Profile Summary</h2>

        <p className="text-sm text-muted mt-1">
          Overview of your saved personal and health information.
        </p>
      </div>

      <div className="flex justify-center">
        {userInfo?.profilePhotoUrl ? (
          <img
            src={userInfo.profilePhotoUrl}
            alt={`${userInfo?.name || "User"} profile`}
            className="h-28 w-28 rounded-full object-cover border-4 border-white shadow-md"
          />
        ) : (
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-sky-100 text-3xl font-semibold text-sky-700">
            {userInfo?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}

        <EmergencyCardExport userInfo={userInfo} profile={profile} />
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

          <InfoItem
            label="Present Location"
            value={formatLocation(location)}
            full
          />
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

      {/* Emergency Contacts */}
      <div className="mb-8">
        <h3 className="section-title text-lg mb-4">Emergency Contacts</h3>

        {emergencyContacts.length ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="surface-muted p-4">
                <p className="small-label uppercase tracking-wide">
                  {contact.relation || `Contact ${index + 1}`}
                </p>

                <p className="mt-2 font-semibold text-slate-800">
                  {contact.name}
                </p>

                {contact.phone && (
                  <p className="mt-2 text-sm text-slate-600">{contact.phone}</p>
                )}

                {contact.email && (
                  <p className="mt-1 text-sm text-slate-600 break-words">
                    {contact.email}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="surface-muted p-4">
            <p className="subtitle">No emergency contacts added.</p>
          </div>
        )}
      </div>

      {/* Blood Donation */}
      <div>
        <h3 className="section-title text-lg mb-4">Blood Donation</h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoItem
            label="Donor Status"
            value={formatDonorStatus(profile?.bloodDonorStatus)}
          />

          <InfoItem
            label="honorarium/travel cost? (সম্মানী/গাড়ি ভাড়া)"
            value={formatCompensation(profile?.bloodDonationCompensation)}
          />

          <InfoItem
            label="Last Blood Donation"
            value={formatDonationDate(profile?.lastBloodDonation)}
          />

          <InfoItem
            label="Contact Number"
            value={profile?.bloodDonationContactNumber}
          />
        </div>
      </div>
    </div>
  );
}
