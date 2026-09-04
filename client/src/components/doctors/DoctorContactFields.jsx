import { Plus, Trash2 } from "lucide-react";

export default function DoctorContactFields({ contactInfo, onChange }) {
  function updateArray(field, index, value) {
    const updated = [...contactInfo[field]];

    updated[index] = value;

    onChange(field, updated);
  }

  function addItem(field) {
    onChange(field, [...contactInfo[field], ""]);
  }

  function removeItem(field, index) {
    onChange(
      field,
      contactInfo[field].filter((_, itemIndex) => itemIndex !== index),
    );
  }

  return (
    <section className="ms-form-section ms-doctor-form-section">
      <div className="ms-doctor-form-section-header">
        <div>
          <h3 className="ms-doctor-form-section-title">Contact Information</h3>

          {/* <p className="ms-doctor-form-section-description">
            Add phone numbers, email addresses, and professional links.
          </p> */}
        </div>
      </div>

      <div className="ms-stack-lg">
        {/* Phones */}
        <div className="ms-doctor-contact-group">
          <div className="ms-doctor-contact-header">
            <label className="ms-label">Phone Numbers</label>

            <button
              type="button"
              onClick={() => addItem("phones")}
              className="ms-btn ms-btn-ghost ms-doctor-contact-add"
            >
              <Plus size={15} aria-hidden="true" />
              Add Phone
            </button>
          </div>

          <div className="ms-doctor-contact-list">
            {contactInfo.phones.map((phone, index) => (
              <div key={index} className="ms-doctor-array-field">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => updateArray("phones", index, e.target.value)}
                  placeholder="Phone number"
                  className="ms-input"
                />

                <button
                  type="button"
                  onClick={() => removeItem("phones", index)}
                  className="ms-btn ms-btn-icon ms-btn-danger"
                  aria-label={`Remove phone ${index + 1}`}
                >
                  <Trash2 size={17} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Emails */}
        <div className="ms-doctor-contact-group">
          <div className="ms-doctor-contact-header">
            <label className="ms-label">Email Addresses</label>

            <button
              type="button"
              onClick={() => addItem("emails")}
              className="ms-btn ms-btn-ghost ms-doctor-contact-add"
            >
              <Plus size={15} aria-hidden="true" />
              Add Email
            </button>
          </div>

          <div className="ms-doctor-contact-list">
            {contactInfo.emails.map((email, index) => (
              <div key={index} className="ms-doctor-array-field">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => updateArray("emails", index, e.target.value)}
                  placeholder="Email address"
                  className="ms-input"
                />

                <button
                  type="button"
                  onClick={() => removeItem("emails", index)}
                  className="ms-btn ms-btn-icon ms-btn-danger"
                  aria-label={`Remove email ${index + 1}`}
                >
                  <Trash2 size={17} aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
