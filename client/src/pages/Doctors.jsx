import { useState } from "react";
import { Stethoscope } from "lucide-react";

import { useDoctors } from "../context/DoctorContext";
import DoctorCard from "../components/doctors/DoctorCard";
import DoctorForm from "../components/doctors/DoctorForm";

export default function Doctors() {
  const { doctors, fetchDoctors } = useDoctors();

  const [editingDoctor, setEditingDoctor] = useState(null);

  function handleEdit(doctor) {
    setEditingDoctor(doctor);
  }

  function handleCancel() {
    setEditingDoctor(null);
  }

  function handleSaved() {
    setEditingDoctor(null);
    fetchDoctors();
  }

  async function handleDelete(id) {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/doctors/${id}`,
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

      fetchDoctors();

      if (editingDoctor?._id === id) {
        setEditingDoctor(null);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className="ms-page ms-doctors-page">
      <div className="ms-container">
        <section className="ms-page-header ms-doctors-header">
          <div className="ms-doctors-heading">
            <div className="ms-doctors-title-row">
              <div className="ms-icon-box ms-doctors-page-icon">
                <Stethoscope size={24} aria-hidden="true" />
              </div>

              <div>
                <h1 className="ms-page-title">My Doctors</h1>
              </div>
            </div>

            <p className="ms-page-subtitle">
              Manage your healthcare providers, hospitals, chambers, and contact
              information.
            </p>
          </div>
        </section>

        <div className="ms-doctors-layout">
          <section className="ms-doctors-list-column">
            <div className="ms-doctors-list-header">
              <div>
                <p className="ms-doctors-list-description">
                  {doctors.length} Doctor
                  {doctors.length === 1 ? "" : "s"} Saved
                </p>
              </div>
            </div>

            {doctors.length ? (
              <div className="ms-doctors-list">
                {doctors.map((doctor) => (
                  <DoctorCard
                    key={doctor._id}
                    doctor={doctor}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : (
              <div className="ms-card ms-empty-state ms-doctors-empty">
                <div className="ms-doctors-empty-icon">
                  <Stethoscope size={34} aria-hidden="true" />
                </div>

                <h3 className="ms-doctors-empty-title">No doctors added</h3>

                <p className="ms-doctors-empty-text">
                  Add your doctors to keep healthcare contacts organized.
                </p>
              </div>
            )}
          </section>

          <DoctorForm
            editingDoctor={editingDoctor}
            onSaved={handleSaved}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </main>
  );
}
