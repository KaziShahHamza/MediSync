// src/components/profile/ProfileSummary.jsx

function InfoItem({ label, value, full = false }) {
  return (
    <div
      className={`ms-profile-info-item ${
        full ? "ms-profile-info-item-full" : ""
      }`}
    >
      <p className="ms-profile-info-label">{label}</p>

      <p className="ms-profile-info-value">
        {value || "-"}
      </p>
    </div>
  );
}

export default function ProfileSummary({ userInfo, form }) {
  return (
    <aside className="ms-card ms-profile-summary">
      <div className="ms-profile-summary-header">
        <div>
          <p className="ms-profile-summary-eyebrow">
            Overview
          </p>

          <h2>Profile Summary</h2>

          <p>
            A quick overview of your saved personal and health
            information.
          </p>
        </div>
      </div>

      <div className="ms-profile-info-grid">
        <InfoItem
          label="Name"
          value={form.name}
        />

        <InfoItem
          label="Username"
          value={userInfo?.username}
        />

        <InfoItem
          label="Email"
          value={userInfo?.email}
          full
        />

        <InfoItem
          label="Date of Birth"
          value={
            form.dob
              ? new Date(form.dob).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "-"
          }
        />

        <InfoItem
          label="Gender"
          value={form.gender}
        />

        <InfoItem
          label="Height"
          value={
            form.height.feet !== ""
              ? `${form.height.feet} ft ${
                  form.height.inches || 0
                } in`
              : "-"
          }
        />

        <InfoItem
          label="Blood Group"
          value={form.bloodGroup}
        />

        <InfoItem
          label="Smoking"
          value={form.smoking}
        />

        <InfoItem
          label="Alcohol"
          value={form.alcohol}
        />

        <InfoItem
          label="Exercise"
          value={form.exercise}
        />

        <InfoItem
          label="Diet"
          value={form.diet}
        />

        <InfoItem
          label="Allergies"
          value={form.allergies || "None"}
          full
        />

        <InfoItem
          label="Surgeries"
          value={form.surgeries || "None"}
          full
        />

        <InfoItem
          label="Emergency Contact"
          value={
            form.emergencyContact.name
              ? `${form.emergencyContact.name}${
                  form.emergencyContact.phone
                    ? ` — ${form.emergencyContact.phone}`
                    : ""
                }`
              : "-"
          }
          full
        />

        <div className="ms-profile-illness-summary">
          <p className="ms-profile-info-label">
            Chronic Illnesses
          </p>

          {form.chronicIllnesses.length > 0 ? (
            <div className="ms-profile-illness-list">
              {form.chronicIllnesses.map((item) => (
                <span
                  className="ms-badge ms-badge-neutral"
                  key={item}
                >
                  {item}
                </span>
              ))}
            </div>
          ) : (
            <p className="ms-profile-none-text">None reported</p>
          )}
        </div>
      </div>
    </aside>
  );
}