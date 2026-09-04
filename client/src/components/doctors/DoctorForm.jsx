// src/components/doctor/DoctorForm.jsx

import { useEffect, useState } from "react";
import { Plus, Save, Stethoscope, X } from "lucide-react";

import hospitals from "../../data/hospitals.json";
import specialties from "../../data/specialties.json";
import designations from "../../data/designations.json";
import degrees from "../../data/degrees.json";

import DoctorChambers from "./DoctorChambers";
import DoctorContactFields from "./DoctorContactFields";

const emptyChamber = {
  name: "",
  address: "",
  phone: "",
  serialNumber: "",
  visitingDays: [],
  visitingTime: "",
};

const createEmptyForm = () => ({
  name: "",
  bmdcRegNo: "",
  degrees: [],
  specialities: [],
  designation: "",
  primaryHospital: "",
  chambers: [
    {
      ...emptyChamber,
      visitingDays: [],
    },
  ],
  contactInfo: {
    phones: [],
    emails: [],
    website: "",
    facebook: "",
    linkedin: "",
  },
  notes: "",
});

const API_URL = import.meta.env.VITE_API_URL;

export default function DoctorForm({ editingDoctor, onSaved, onCancel }) {
  const [form, setForm] = useState(createEmptyForm);

  /*
   * Populate the form when editingDoctor changes.
   */
  useEffect(() => {
    if (!editingDoctor) {
      setForm(createEmptyForm());
      return;
    }

    setForm({
      name: editingDoctor.name || "",
      bmdcRegNo: editingDoctor.bmdcRegNo || "",
      degrees: editingDoctor.degrees || [],
      specialities: editingDoctor.specialities || [],
      designation: editingDoctor.designation || "",
      primaryHospital: editingDoctor.primaryHospital || "",

      chambers:
        editingDoctor.chambers?.length > 0
          ? editingDoctor.chambers.map((chamber) => ({
              name: chamber.name || "",
              address: chamber.address || "",
              phone: chamber.phone || "",
              serialNumber: chamber.serialNumber || "",
              visitingDays: chamber.visitingDays || [],
              visitingTime: chamber.visitingTime || "",
            }))
          : [
              {
                ...emptyChamber,
                visitingDays: [],
              },
            ],

      contactInfo: {
        phones: editingDoctor.contactInfo?.phones || [],
        emails: editingDoctor.contactInfo?.emails || [],
        website: editingDoctor.contactInfo?.website || "",
        facebook: editingDoctor.contactInfo?.facebook || "",
        linkedin: editingDoctor.contactInfo?.linkedin || "",
      },

      notes: editingDoctor.notes || "",
    });
  }, [editingDoctor]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function updateChamber(index, field, value) {
    setForm((prev) => ({
      ...prev,
      chambers: prev.chambers.map((chamber, chamberIndex) =>
        chamberIndex === index
          ? {
              ...chamber,
              [field]: value,
            }
          : chamber,
      ),
    }));
  }

  function addChamber() {
    setForm((prev) => ({
      ...prev,
      chambers: [
        ...prev.chambers,
        {
          ...emptyChamber,
          visitingDays: [],
        },
      ],
    }));
  }

  function removeChamber(index) {
    setForm((prev) => ({
      ...prev,
      chambers: prev.chambers.filter(
        (_, chamberIndex) => chamberIndex !== index,
      ),
    }));
  }

  function updateContactInfo(field, value) {
    setForm((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value,
      },
    }));
  }

  function handlePhoneChange(index, value) {
    setForm((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        phones: prev.contactInfo.phones.map((phone, phoneIndex) =>
          phoneIndex === index ? value : phone,
        ),
      },
    }));
  }

  function addPhone() {
    setForm((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        phones: [...prev.contactInfo.phones, ""],
      },
    }));
  }

  function removePhone(index) {
    setForm((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        phones: prev.contactInfo.phones.filter(
          (_, phoneIndex) => phoneIndex !== index,
        ),
      },
    }));
  }

  function handleEmailChange(index, value) {
    setForm((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        emails: prev.contactInfo.emails.map((email, emailIndex) =>
          emailIndex === index ? value : email,
        ),
      },
    }));
  }

  function addEmail() {
    setForm((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        emails: [...prev.contactInfo.emails, ""],
      },
    }));
  }

  function removeEmail(index) {
    setForm((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        emails: prev.contactInfo.emails.filter(
          (_, emailIndex) => emailIndex !== index,
        ),
      },
    }));
  }

  function handleMultiSelectChange(e, field) {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value,
    );

    setForm((prev) => ({
      ...prev,
      [field]: values,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      console.error("Authentication token not found.");
      return;
    }

    const cleanedForm = {
      ...form,

      degrees: form.degrees.filter((degree) => degree.trim() !== ""),

      specialities: form.specialities.filter(
        (speciality) => speciality.trim() !== "",
      ),

      chambers: form.chambers.map((chamber) => ({
        ...chamber,
        visitingDays: Array.isArray(chamber.visitingDays)
          ? chamber.visitingDays
          : [],
      })),

      contactInfo: {
        ...form.contactInfo,

        phones: form.contactInfo.phones.filter((phone) => phone.trim() !== ""),

        emails: form.contactInfo.emails.filter((email) => email.trim() !== ""),
      },
    };

    const isEditing = Boolean(editingDoctor?._id);

    const url = isEditing
      ? `${API_URL}/api/doctors/${editingDoctor._id}`
      : `${API_URL}/api/doctors`;

    try {
      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cleanedForm),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);

        throw new Error(
          errorData?.message ||
            `Failed to ${isEditing ? "update" : "create"} doctor.`,
        );
      }

      setForm(createEmptyForm());

      /*
       * Doctors.jsx handles refreshing the list
       * and clearing editing state.
       */
      onSaved();
    } catch (err) {
      console.error("Failed to save doctor:", err);
    }
  }

  function handleCancel() {
    setForm(createEmptyForm());
    onCancel();
  }

  const isEditing = Boolean(editingDoctor?._id);

  return (
    <aside className="ms-card ms-doctor-form-card">
      <div className="ms-doctor-form-header">
        {/* <div className="ms-icon-box ms-doctor-form-icon">
          <Stethoscope size={26} aria-hidden="true" />
        </div> */}

        <div>
          <p className="ms-doctors-eyebrow">
            {isEditing ? "Edit doctor" : "New doctor"}
          </p>

          {/* <h2 className="ms-section-title">
            {isEditing ? "Update doctor" : "Add a doctor"}
          </h2> */}

          {/* <p className="ms-form-section-description">
            Keep your healthcare provider information organized.
          </p> */}
        </div>
      </div>

      <form className="ms-form ms-doctor-form" onSubmit={handleSubmit}>
        <section className="ms-form-section ms-doctor-form-section">
          <div className="ms-form-section-header">
            {/* <h3 className="ms-form-section-title">Professional information</h3> */}
{/* 
            <p className="ms-form-section-description">
              Add the doctor's professional and registration details.
            </p> */}
          </div>

          <div className="ms-form-grid">
            <div className="ms-field ms-field-full">
              <label className="ms-label" htmlFor="doctor-name">
                Doctor name
              </label>

              <input
                id="doctor-name"
                name="name"
                type="text"
                className="ms-input"
                value={form.name}
                onChange={handleChange}
                placeholder="Dr. Ahmed Rahman"
                required
              />
            </div>

            <div className="ms-field">
              <label className="ms-label" htmlFor="bmdc-reg-no">
                BMDC registration number
              </label>

              <input
                id="bmdc-reg-no"
                name="bmdcRegNo"
                type="text"
                className="ms-input"
                value={form.bmdcRegNo}
                onChange={handleChange}
                placeholder="A-12345"
              />
            </div>

            <div className="ms-field">
              <label className="ms-label" htmlFor="designation">
                Designation
              </label>

              <select
                id="designation"
                name="designation"
                className="ms-select"
                value={form.designation}
                onChange={handleChange}
              >
                <option value="">Select designation</option>

                {designations.map((designation) => (
                  <option key={designation} value={designation}>
                    {designation}
                  </option>
                ))}
              </select>
            </div>

            <div className="ms-field">
              <label className="ms-label" htmlFor="primary-hospital">
                Primary hospital
              </label>

              <select
                id="primary-hospital"
                name="primaryHospital"
                className="ms-select"
                value={form.primaryHospital}
                onChange={handleChange}
              >
                <option value="">Select hospital</option>

                {hospitals.map((hospital) => (
                  <option key={hospital.name} value={hospital.name}>
                    {hospital.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="ms-field">
              <label className="ms-label" htmlFor="degrees">
                Degrees
              </label>

              <select
                id="degrees"
                className="ms-select ms-doctor-multi-select"
                multiple
                value={form.degrees}
                onChange={(e) => handleMultiSelectChange(e, "degrees")}
              >
                {degrees.map((degree) => (
                  <option key={degree} value={degree}>
                    {degree}
                  </option>
                ))}
              </select>

              <p className="ms-help-text">
                Hold Ctrl/Cmd to select multiple degrees.
              </p>
            </div>

            <div className="ms-field">
              <label className="ms-label" htmlFor="specialities">
                Specialities
              </label>

              <select
                id="specialities"
                className="ms-select ms-doctor-multi-select"
                multiple
                value={form.specialities}
                onChange={(e) => handleMultiSelectChange(e, "specialities")}
              >
                {specialties.map((speciality) => (
                  <option key={speciality} value={speciality}>
                    {speciality}
                  </option>
                ))}
              </select>

              <p className="ms-help-text">
                Hold Ctrl/Cmd to select multiple specialities.
              </p>
            </div>
          </div>
        </section>

        <section className="ms-form-section ms-doctor-form-section">
          <div className="ms-form-section-header">
            <div>
              <h3 className="ms-form-section-title">Chambers</h3>

              {/* <p className="ms-form-section-description">
                Add the locations and visiting schedules where this doctor sees
                patients.
              </p> */}
            </div>

            <button
              type="button"
              className="ms-btn ms-btn-secondary"
              onClick={addChamber}
            >
              <Plus size={16} aria-hidden="true" />
              Add chamber
            </button>
          </div>

          <DoctorChambers
            chambers={form.chambers}
            onChange={updateChamber}
            onAdd={addChamber}
            onRemove={removeChamber}
          />
        </section>

        <section className="ms-form-section ms-doctor-form-section">
          {/* <div className="ms-form-section-header">
            <h3 className="ms-form-section-title">Contact information</h3>

            <p className="ms-form-section-description">
              Add phone numbers, emails and online contact details.
            </p>
          </div> */}

          <DoctorContactFields
            contactInfo={form.contactInfo}
            onChange={updateContactInfo}
            onPhoneChange={handlePhoneChange}
            onAddPhone={addPhone}
            onRemovePhone={removePhone}
            onEmailChange={handleEmailChange}
            onAddEmail={addEmail}
            onRemoveEmail={removeEmail}
          />
        </section>

        <section className="ms-form-section ms-doctor-form-section">
          {/* <div className="ms-form-section-header">
            <h3 className="ms-form-section-title">Notes</h3>

            <p className="ms-form-section-description">
              Add any additional information you want to remember.
            </p>
          </div> */}

          {/* <div className="ms-field">
            <label className="ms-label" htmlFor="doctor-notes">
              Notes
            </label>

            <textarea
              id="doctor-notes"
              name="notes"
              className="ms-input ms-textarea"
              value={form.notes}
              onChange={handleChange}
              placeholder="Additional notes about this doctor..."
              rows={4}
            />
          </div> */}
        </section>

        <div className="ms-doctor-form-actions">
          {isEditing && (
            <button
              type="button"
              className="ms-btn ms-btn-ghost"
              onClick={handleCancel}
            >
              <X size={16} aria-hidden="true" />
              Cancel
            </button>
          )}

          <button type="submit" className="ms-btn ms-btn-primary">
            <Save size={16} aria-hidden="true" />

            {isEditing ? "Update doctor" : "Save doctor"}
          </button>
        </div>
      </form>
    </aside>
  );
}
