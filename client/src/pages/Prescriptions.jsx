// src/pages/Prescriptions.jsx

import { useState } from "react";
import { FileImage } from "lucide-react";

import { usePrescriptions } from "../context/PrescriptionContext";
import PrescriptionCard from "../components/prescription/PrescriptionCard";
import PrescriptionUpload from "../components/prescription/PrescriptionUpload";
import PrescriptionPreview from "../components/prescription/PrescriptionPreview";

function Prescriptions() {
  const { prescriptions, fetchPrescriptions } = usePrescriptions();

  const [selected, setSelected] = useState(null);

  const handleUploaded = async () => {
    await fetchPrescriptions();
  };

  const handleDeleted = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this prescription?",
    );

    if (!confirmed) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL;

      const res = await fetch(`${API_URL}/api/prescriptions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete prescription");
      }

      if (selected?._id === id) {
        setSelected(null);
      }

      await fetchPrescriptions();
    } catch (err) {
      console.error(err);
      window.alert("Failed to delete prescription. Please try again.");
    }
  };

  return (
    <main className="ms-page ms-prescriptions-page">
      <div className="ms-container">
        <header className="ms-page-header ms-prescriptions-header">
          <div>
            <p className="ms-page-eyebrow">Medical records</p>

            <h1 className="ms-page-title">Prescriptions</h1>

            <p className="ms-page-subtitle">
              Store prescription images securely and get an AI-generated
              summary for easier reference.
            </p>
          </div>
        </header>

        <section className="ms-prescriptions-layout">
          <div className="ms-prescriptions-gallery">
            <div className="ms-prescriptions-list-header">
              <div>
                <h2 className="ms-section-title">Your prescriptions</h2>

                <p className="ms-section-subtitle">
                  {prescriptions.length === 0
                    ? "No prescriptions uploaded yet."
                    : `${prescriptions.length} ${
                        prescriptions.length === 1
                          ? "prescription"
                          : "prescriptions"
                      }`}
                </p>
              </div>

              <span className="ms-prescriptions-count">
                {prescriptions.length}
              </span>
            </div>

            {prescriptions.length > 0 ? (
              <div className="ms-prescriptions-grid">
                {prescriptions.map((prescription) => (
                  <PrescriptionCard
                    key={prescription._id}
                    prescription={prescription}
                    onOpen={setSelected}
                    onDelete={handleDeleted}
                  />
                ))}
              </div>
            ) : (
              <div className="ms-empty-state ms-prescriptions-empty">
                <div className="ms-empty-state-icon">
                  <FileImage size={28} strokeWidth={1.7} />
                </div>

                <h3>No prescriptions yet</h3>

                <p>
                  Upload your first prescription to keep your medical records
                  organized in one place.
                </p>
              </div>
            )}
          </div>

          <aside className="ms-prescriptions-upload-column">
            <PrescriptionUpload onUploaded={handleUploaded} />
          </aside>
        </section>
      </div>

      {selected && (
        <PrescriptionPreview
          prescription={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </main>
  );
}

export default Prescriptions;