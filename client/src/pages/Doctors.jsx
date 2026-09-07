// client/src/pages/Doctors.jsx

import { useState } from "react";
import { useDoctors } from "../context/DoctorContext";
import DoctorCard from "../components/DoctorCard";
import DoctorForm, {
  emptyForm,
  emptyChamber,
} from "../components/DoctorForm";
import DoctorModal from "../components/DoctorModal";

const API_URL = import.meta.env.VITE_API_URL;

export default function Doctors() {
  const { doctors, fetchDoctors } = useDoctors();

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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
              visitingTime: {
                startHour:
                  chamber.visitingTime?.startHour ?? "6",
                startPeriod:
                  chamber.visitingTime?.startPeriod ?? "PM",
                endHour:
                  chamber.visitingTime?.endHour ?? "9",
                endPeriod:
                  chamber.visitingTime?.endPeriod ?? "PM",
              },
            }))
          : [
              {
                ...emptyChamber,
                visitingDays: [],
                visitingTime: {
                  ...emptyChamber.visitingTime,
                },
              },
            ],

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
      chambers: [
        {
          ...emptyChamber,
          visitingDays: [],
          visitingTime: {
            ...emptyChamber.visitingTime,
          },
        },
      ],
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

      degrees: form.degrees.filter(
        (degree) => degree.trim() !== "",
      ),

      specialities: form.specialities.filter(
        (speciality) => speciality.trim() !== "",
      ),

      chambers: form.chambers.map((chamber) => ({
        ...chamber,
        visitingDays: chamber.visitingDays || [],
      })),

      contactInfo: {
        ...form.contactInfo,

        phones: form.contactInfo.phones.filter(
          (phone) => phone.trim() !== "",
        ),

        emails: form.contactInfo.emails.filter(
          (email) => email.trim() !== "",
        ),
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
      await fetchDoctors();
    } catch (error) {
      console.error(error);
    }
  }

  async function deleteDoctor(id) {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${API_URL}/api/doctors/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete doctor");
      }

      if (selectedDoctor?._id === id) {
        setSelectedDoctor(null);
      }

      await fetchDoctors();
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
          Manage your healthcare providers, hospitals, chambers,
          and contact information.
        </p>
      </section>

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_720px]">
        {/* Doctor List */}
        <section>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="section-title">Doctor Records</h2>

              <p className="mt-1 text-sm text-slate-500">
                {doctors.length} doctor
                {doctors.length === 1 ? "" : "s"} saved
              </p>
            </div>
          </div>

          {doctors.length > 0 ? (
            <div className="space-y-6">
              {doctors.map((doctor) => (
                <DoctorCard
                  key={doctor._id}
                  doctor={doctor}
                  onEdit={editDoctor}
                  onDelete={deleteDoctor}
                  onOpen={setSelectedDoctor}
                />
              ))}
            </div>
          ) : (
            <div className="card py-14 text-center">
              <h3 className="text-xl font-semibold text-slate-800">
                No doctors added
              </h3>

              <p className="mt-2 text-slate-500">
                Add your doctors to keep healthcare contacts
                organized.
              </p>
            </div>
          )}
        </section>

        {/* Doctor Form */}
        <DoctorForm
          form={form}
          editingId={editingId}
          onChange={handleChange}
          onSubmit={saveDoctor}
          onReset={resetForm}
          setForm={setForm}
        />
      </div>

      {/* Doctor Details Modal */}
      {selectedDoctor && (
        <DoctorModal
          doctor={selectedDoctor}
          onClose={() => setSelectedDoctor(null)}
          onEdit={editDoctor}
        />
      )}
    </div>
  );
}