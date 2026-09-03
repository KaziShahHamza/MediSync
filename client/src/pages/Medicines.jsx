import { useEffect, useState } from "react";
import { Pill, PlusCircle } from "lucide-react";

import MedicineForm from "../components/medicine/MedicineForm";
import MedicineList from "../components/medicine/MedicineList";

export default function Medicines() {
  const [meds, setMeds] = useState([]);
  const [editing, setEditing] = useState(null);

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchMeds = async () => {
    const res = await fetch(`${API_URL}/api/medicines`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setMeds(await res.json());
  };

  useEffect(() => {
    fetchMeds();
  }, []);

  const saveMedicine = async (data) => {
    if (editing) {
      await fetch(`${API_URL}/api/medicines/${editing._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      setEditing(null);
    } else {
      await fetch(`${API_URL}/api/medicines`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
    }

    fetchMeds();
  };

  const deleteMedicine = async (id) => {
    await fetch(`${API_URL}/api/medicines/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchMeds();
  };

  return (
    <main className="ms-page ms-medicines-page">
      <div className="ms-container">
        {/* Header */}
        <section className="ms-page-header ms-medicines-header">
          <div className="ms-medicines-heading">
            <div className="ms-medicines-title-row">
              <div className="ms-icon-box ms-medicines-page-icon">
                <Pill size={24} aria-hidden="true" />
              </div>

              <div>
                <span className="ms-medicines-eyebrow">
                  Medication management
                </span>

                <h1 className="ms-page-title">Medicines</h1>
              </div>
            </div>

            <p className="ms-page-subtitle">
              Manage your medications, dosage schedules, and treatment
              information.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="ms-medicines-layout">
          {/* Medicine List */}
          <div className="ms-medicines-list-column">
            <div className="ms-medicines-section-header">
              <div>
                <span className="ms-medicines-section-eyebrow">
                  Medication records
                </span>

                <h2 className="ms-section-title">My Medicines</h2>
              </div>

              <span className="ms-badge ms-medicines-count">
                {meds.length} {meds.length === 1 ? "Medicine" : "Total"}
              </span>
            </div>

            <MedicineList
              medicines={meds}
              onEdit={setEditing}
              onDelete={deleteMedicine}
            />
          </div>

          {/* Form */}
          <div className="ms-medicines-form-column">
            <div className="ms-medicines-form-header">
              <div className="ms-icon-box ms-medicines-form-icon">
                <PlusCircle size={22} aria-hidden="true" />
              </div>

              <div>
                <span className="ms-medicines-section-eyebrow">
                  Medication details
                </span>

                <h2 className="ms-section-title">
                  {editing ? "Edit Medicine" : "Add Medicine"}
                </h2>
              </div>
            </div>

            <MedicineForm onSave={saveMedicine} editing={editing} />
          </div>
        </section>
      </div>
    </main>
  );
}

