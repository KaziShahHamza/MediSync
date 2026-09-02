// client/src/pages/Doctors.jsx

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useDoctors } from "../context/DoctorContext";
import DoctorCard from "../components/DoctorCard";
import hospitals from "../data/hospitals.json";
import specialties from "../data/specialties.json";
import designations from "../data/designations.json";
import days from "../data/days.json";
import degrees from "../data/degrees.json";

const emptyChamber = {
  name: "",
  address: "",
  phone: "",
  serialNumber: "",
  visitingDays: [],
  visitingTime: "",
};

const emptyForm = {
  name: "",
  bmdcRegNo: "",
  degrees: [],
  specialities: [],
  designation: "",
  primaryHospital: "",
  chambers: [{ ...emptyChamber }],
  contactInfo: {
    phones: [],
    emails: [],
    website: "",
    facebook: "",
    linkedin: "",
  },
  notes: "",
};

const API_URL = import.meta.env.VITE_API_URL;

export default function Doctors() {
  const { doctors, fetchDoctors } = useDoctors();

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function toggleSpeciality(speciality) {
    setForm((prev) => ({
      ...prev,
      specialities: prev.specialities.includes(speciality)
        ? prev.specialities.filter((item) => item !== speciality)
        : [...prev.specialities, speciality],
    }));
  }

  function handleDegreeChange(index, value) {
    setForm((prev) => {
      const degrees = [...prev.degrees];
      degrees[index] = value;

      return {
        ...prev,
        degrees,
      };
    });
  }

  function addDegree() {
    setForm((prev) => ({
      ...prev,
      degrees: [...prev.degrees, ""],
    }));
  }

  function removeDegree(index) {
    setForm((prev) => ({
      ...prev,
      degrees: prev.degrees.filter((_, i) => i !== index),
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
    setForm((prev) => {
      const phones = [...prev.contactInfo.phones];
      phones[index] = value;

      return {
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          phones,
        },
      };
    });
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
        phones: prev.contactInfo.phones.filter((_, i) => i !== index),
      },
    }));
  }

  function handleEmailChange(index, value) {
    setForm((prev) => {
      const emails = [...prev.contactInfo.emails];
      emails[index] = value;

      return {
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          emails,
        },
      };
    });
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
        emails: prev.contactInfo.emails.filter((_, i) => i !== index),
      },
    }));
  }

  function updateChamber(index, field, value) {
    setForm((prev) => {
      const chambers = [...prev.chambers];

      chambers[index] = {
        ...chambers[index],
        [field]: value,
      };

      return {
        ...prev,
        chambers,
      };
    });
  }

  function toggleChamberDay(chamberIndex, day) {
    setForm((prev) => {
      const chambers = [...prev.chambers];
      const chamber = chambers[chamberIndex];

      const visitingDays = chamber.visitingDays.includes(day)
        ? chamber.visitingDays.filter((item) => item !== day)
        : [...chamber.visitingDays, day];

      chambers[chamberIndex] = {
        ...chamber,
        visitingDays,
      };

      return {
        ...prev,
        chambers,
      };
    });
  }

  function addChamber() {
    setForm((prev) => ({
      ...prev,
      chambers: [...prev.chambers, { ...emptyChamber, visitingDays: [] }],
    }));
  }

  function removeChamber(index) {
    setForm((prev) => {
      if (prev.chambers.length === 1) {
        return prev;
      }

      return {
        ...prev,
        chambers: prev.chambers.filter((_, i) => i !== index),
      };
    });
  }

  function editDoctor(doctor) {
    setEditingId(doctor._id);

    setForm({
      name: doctor.name || "",
      bmdcRegNo: doctor.bmdcRegNo || "",
      degrees: doctor.degrees || [],
      specialities: doctor.specialities || [],
      designation: doctor.designation || "",
      primaryHospital: doctor.primaryHospital || "",
      chambers:
        doctor.chambers?.length > 0
          ? doctor.chambers.map((chamber) => ({
              name: chamber.name || "",
              address: chamber.address || "",
              phone: chamber.phone || "",
              serialNumber: chamber.serialNumber || "",
              visitingDays: chamber.visitingDays || [],
              visitingTime: chamber.visitingTime || "",
            }))
          : [{ ...emptyChamber, visitingDays: [] }],
      contactInfo: {
        phones: doctor.contactInfo?.phones || [],
        emails: doctor.contactInfo?.emails || [],
        website: doctor.contactInfo?.website || "",
        facebook: doctor.contactInfo?.facebook || "",
        linkedin: doctor.contactInfo?.linkedin || "",
      },
      notes: doctor.notes || "",
    });
  }

  function resetForm() {
    setForm({
      ...emptyForm,
      degrees: [],
      specialities: [],
      chambers: [{ ...emptyChamber, visitingDays: [] }],
      contactInfo: {
        phones: [],
        emails: [],
        website: "",
        facebook: "",
        linkedin: "",
      },
    });

    setEditingId(null);
  }

  async function saveDoctor(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const cleanedForm = {
      ...form,

      degrees: form.degrees.filter((degree) => degree.trim() !== ""),

      chambers: form.chambers.map((chamber) => ({
        ...chamber,
        visitingDays: chamber.visitingDays || [],
      })),

      contactInfo: {
        ...form.contactInfo,
        phones: form.contactInfo.phones.filter((phone) => phone.trim() !== ""),
        emails: form.contactInfo.emails.filter((email) => email.trim() !== ""),
      },
    };

    try {
      const response = await fetch(
        editingId
          ? `${API_URL}/api/doctors/${editingId}`
          : `${API_URL}/api/doctors`,
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cleanedForm),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to save doctor");
      }

      resetForm();
      fetchDoctors();
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteDoctor(id) {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/api/doctors/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete doctor");
      }

      fetchDoctors();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="container page">
      {/* Header */}
      <section className="mb-10">
        <h1 className="page-title">My Doctors</h1>

        <p className="mt-3 text-slate-600">
          Manage your healthcare providers, hospitals, chambers, and contact
          information.
        </p>
      </section>

      <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-start">
        {/* Doctor List */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="section-title">Doctor Records</h2>

              <p className="text-sm text-slate-500 mt-1">
                {doctors.length} doctor
                {doctors.length === 1 ? "" : "s"} saved
              </p>
            </div>
          </div>

          {doctors.length ? (
            <div className="space-y-6">
              {doctors.map((doctor) => (
                <DoctorCard
                  key={doctor._id}
                  doctor={doctor}
                  onEdit={editDoctor}
                  onDelete={deleteDoctor}
                />
              ))}
            </div>
          ) : (
            <div className="card py-14 text-center">
              <h3 className="text-xl font-semibold text-slate-800">
                No doctors added
              </h3>

              <p className="mt-2 text-slate-500">
                Add your doctors to keep healthcare contacts organized.
              </p>
            </div>
          )}
        </section>

        {/* Doctor Form */}
        <aside className="card sticky top-24">
          <div className="mb-6">
            <h2 className="card-title">
              {editingId ? "Update Doctor" : "Add Doctor"}
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Store professional, chamber, and contact details.
            </p>
          </div>

          <form onSubmit={saveDoctor} className="space-y-6">
            {/* Basic Information */}
            <div>
              {/* <h3 className="font-semibold text-slate-800 mb-4">
                Doctor Information
              </h3> */}

              <div className="space-y-4">
                <div>
                  <label>Doctor Name</label>

                  <input
                    name="name"
                    placeholder="Enter doctor name"
                    value={form.name}
                    onChange={handleChange}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label>BMDC Registration Number</label>

                  <input
                    name="bmdcRegNo"
                    placeholder="Example: A-66477"
                    value={form.bmdcRegNo}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>
            </div>

            {/* Degrees */}
            <div>
              <label className="block mb-2 font-medium text-slate-700">
                Degrees
              </label>

              <select
                multiple
                value={form.degrees}
                onChange={(e) => {
                  const values = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value,
                  );

                  setForm((prev) => ({
                    ...prev,
                    degrees: values,
                  }));
                }}
                className="input min-h-40"
              >
                {degrees.map((degree) => (
                  <option key={degree} value={degree}>
                    {degree}
                  </option>
                ))}
              </select>

              <p className="mt-1 text-sm text-slate-500">
                Hold Ctrl/Cmd to select multiple degrees.
              </p>
            </div>

            {/* Specialities */}
            <div>
              <label className="block mb-2 font-medium text-slate-700">
                Specialities
              </label>

              <select
                multiple
                value={form.specialities}
                onChange={(e) => {
                  const values = Array.from(
                    e.target.selectedOptions,
                    (option) => option.value,
                  );

                  setForm((prev) => ({
                    ...prev,
                    specialities: values,
                  }));
                }}
                className="input min-h-40"
              >
                {specialties.map((speciality) => (
                  <option key={speciality} value={speciality}>
                    {speciality}
                  </option>
                ))}
              </select>

              <p className="mt-1 text-sm text-slate-500">
                Select one or more specialities.
              </p>
            </div>

            {/* Designation */}
            <div>
              <label className="block mb-2 font-medium text-slate-700">
                Designation
              </label>

              <select
                name="designation"
                value={form.designation}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select designation</option>

                {designations.map((designation) => (
                  <option key={designation} value={designation}>
                    {designation}
                  </option>
                ))}
              </select>
            </div>

            {/* Designation */}
            <div>
              <label>Primary Hospital</label>

              <select
                name="primaryHospital"
                value={form.primaryHospital}
                onChange={handleChange}
                className="input"
              >
                <option value="">Select Primary Hospital</option>

                {hospitals.map((hospital) => (
                  <option
                    key={`${hospital.name}-${hospital.city}`}
                    value={hospital.name}
                  >
                    {hospital.name} — {hospital.city}
                  </option>
                ))}
              </select>
            </div>

            {/* Chambers */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-slate-800">Chambers</h3>

                  <p className="text-xs text-slate-500 mt-1">
                    Add every chamber where the doctor sees patients.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addChamber}
                  className="flex items-center gap-1 text-sm text-blue-600 font-medium"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>

              <div className="space-y-5">
                {form.chambers.map((chamber, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-slate-800">
                        Chamber {index + 1}
                      </h4>

                      {form.chambers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeChamber(index)}
                          className="text-slate-400 hover:text-red-600"
                        >
                          <Trash2 size={17} />
                        </button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label>Chamber Name</label>

                        <select
                          value={chamber.name}
                          onChange={(e) =>
                            updateChamber(index, "name", e.target.value)
                          }
                          className="input"
                        >
                          <option value="">Select Chamber / Hospital</option>

                          {hospitals.map((hospital) => (
                            <option
                              key={`${hospital.name}-${hospital.city}`}
                              value={hospital.name}
                            >
                              {hospital.name} — {hospital.city}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label>Full Address</label>

                        <textarea
                          value={chamber.address}
                          onChange={(e) =>
                            updateChamber(index, "address", e.target.value)
                          }
                          placeholder="Full chamber address"
                          className="input min-h-20"
                        />
                      </div>

                      <div>
                        <label>Chamber Phone</label>

                        <input
                          value={chamber.phone}
                          onChange={(e) =>
                            updateChamber(index, "phone", e.target.value)
                          }
                          placeholder="Chamber phone number"
                          className="input"
                        />
                      </div>

                      <div>
                        <label className="block mb-2 font-medium text-slate-700">
                          Visiting Days
                        </label>

                        <select
                          multiple
                          value={chamber.visitingDays}
                          onChange={(e) => {
                            const values = Array.from(
                              e.target.selectedOptions,
                              (option) => option.value,
                            );

                            updateChamber(index, "visitingDays", values);
                          }}
                          className="input min-h-40"
                        >
                          {days.map((day) => (
                            <option key={day} value={day}>
                              {day}
                            </option>
                          ))}
                        </select>

                        <p className="mt-1 text-sm text-slate-500">
                          Select all days the doctor visits this chamber.
                        </p>
                      </div>

                      <div>
                        <label>Visiting Time</label>

                        <input
                          value={chamber.visitingTime}
                          onChange={(e) =>
                            updateChamber(index, "visitingTime", e.target.value)
                          }
                          placeholder="Example: 6 PM - 9 PM"
                          className="input"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="font-semibold text-slate-800 mb-4">
                Contact Information
              </h3>

              {/* Phones */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="mb-0">Phone Numbers</label>

                  <button
                    type="button"
                    onClick={addPhone}
                    className="text-sm text-blue-600 font-medium"
                  >
                    + Add Phone
                  </button>
                </div>

                <div className="space-y-2">
                  {form.contactInfo.phones.map((phone, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        value={phone}
                        onChange={(e) =>
                          handlePhoneChange(index, e.target.value)
                        }
                        placeholder="Phone number"
                        className="input flex-1"
                      />

                      <button
                        type="button"
                        onClick={() => removePhone(index)}
                        className="px-3 rounded-xl border border-slate-200 text-slate-500 hover:text-red-600"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emails */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="mb-0">Email Addresses</label>

                  <button
                    type="button"
                    onClick={addEmail}
                    className="text-sm text-blue-600 font-medium"
                  >
                    + Add Email
                  </button>
                </div>

                <div className="space-y-2">
                  {form.contactInfo.emails.map((email, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                          handleEmailChange(index, e.target.value)
                        }
                        placeholder="Email address"
                        className="input flex-1"
                      />

                      <button
                        type="button"
                        onClick={() => removeEmail(index)}
                        className="px-3 rounded-xl border border-slate-200 text-slate-500 hover:text-red-600"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Notes */}
            <div>
              <label>Notes</label>

              <textarea
                name="notes"
                placeholder="Additional notes"
                value={form.notes}
                onChange={handleChange}
                className="input min-h-24"
              />
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button type="submit" className="btn-primary w-full">
                {editingId ? "Update Doctor" : "Add Doctor"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary w-full"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </aside>
      </div>
    </div>
  );
}
