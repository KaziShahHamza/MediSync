// client/src/components/AuthLayout.jsx

export default function AuthLayout({
  title,
  subtitle,
  children,
}) {
  const features = [
    "Medicine reminders",
    "Health tracking",
    "Medical records",
    "Doctor management",
  ];

  return (
    <main className="ms-auth-page">
      <div className="ms-auth-shell">
        {/* LEFT SIDE */}
        <section className="ms-auth-intro">
          <div className="ms-auth-intro-content">
            <span className="ms-auth-eyebrow">
              Personal Health Management
            </span>

            <h1 className="ms-auth-title">
              Manage Your Health
              <span> Smarter</span>
            </h1>

            <p className="ms-auth-description">
              Keep medicines, health records, doctors, and medical
              documents organized in one secure place.
            </p>

            <div className="ms-auth-features">
              {features.map((item) => (
                <div key={item} className="ms-auth-feature">
                  <span
                    className="ms-auth-feature-dot"
                    aria-hidden="true"
                  />

                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FORM AREA */}
        <section className="ms-auth-form">
          <div className="ms-auth-form-header">
            <h2 className="ms-auth-form-title">
              {title}
            </h2>

            <p className="ms-auth-form-subtitle">
              {subtitle}
            </p>
          </div>

          <div className="ms-auth-form-content">
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}