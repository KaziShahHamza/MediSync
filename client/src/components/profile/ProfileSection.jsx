// src/components/profile/ProfileSection.jsx

export default function ProfileSection({
  title,
  description,
  children,
}) {
  return (
    <section className="ms-card ms-profile-section">
      <header className="ms-profile-section-header">
        <h2>{title}</h2>

        {description && <p>{description}</p>}
      </header>

      <div className="ms-profile-section-content">
        {children}
      </div>
    </section>
  );
}