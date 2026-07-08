// client/src/pages/Medicines.jsx
import { useEffect, useState } from "react";
import MedicineForm from "../components/MedicineForm";
import MedicineList from "../components/MedicineList";

export default function Dashboard() {
  const [meds, setMeds] = useState([]);
  const [editing, setEditing] = useState(null);
  const token = localStorage.getItem("token");

  const fetchMeds = async () => {
    const res = await fetch("http://localhost:5000/api/medicines", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setMeds(await res.json());
  };

  useEffect(() => {
    fetchMeds();
  }, []);

  const saveMedicine = async (data) => {
    if (editing) {
      await fetch(`http://localhost:5000/api/medicines/${editing._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      setEditing(null);
    } else {
      await fetch("http://localhost:5000/api/medicines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
    }
    fetchMeds();
  };

  const deleteMedicine = async (id) => {
    await fetch(`http://localhost:5000/api/medicines/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchMeds();
  };

  return (
    <div className="container py-8">
      <h2 className="text-2xl font-semibold mb-6">Your Medicines</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <MedicineList
            medicines={meds}
            onEdit={setEditing}
            onDelete={deleteMedicine}
          />
        </div>

        <div>
          <MedicineForm onSave={saveMedicine} editing={editing} />
        </div>
      </div>

      <div className="mt-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold">
                Prescription Images
              </h3>

              <p className="text-slate-500 mt-2">
                Store your doctor's prescriptions in one place.
                Uploading and managing prescription images will be
                available in a future update.
              </p>
            </div>

            <button
              disabled
              className="btn-primary opacity-60 cursor-not-allowed"
            >
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
