import { useEffect, useState } from "react";
import { Pill, PlusCircle } from "lucide-react";

import MedicineForm from "../components/MedicineForm";
import MedicineList from "../components/MedicineList";

const API_URL = import.meta.env.VITE_API_URL;
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function Dashboard() {
  const [meds, setMeds] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

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

  const uploadMedicineImage = async (file) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    // Optional: organize medicine images in Cloudinary.
    formData.append("folder", "MediSync/medicines");

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!uploadRes.ok) {
      const errorData = await uploadRes.json();

      console.error("Cloudinary upload error:", errorData);

      throw new Error(
        errorData.error?.message || "Failed to upload medicine image.",
      );
    }

    const uploadData = await uploadRes.json();

    return uploadData.secure_url;
  };

  const saveMedicine = async (data) => {
    setLoading(true);

    try {
      let imageUrl = data.imageUrl || "";

      // Upload only when a new image was selected.
      if (data.imageFile) {
        imageUrl = await uploadMedicineImage(data.imageFile);
      }

      const medicineData = {
        name: data.name,
        dosageTimes: data.dosageTimes,
        imageUrl,
        startDate: data.startDate,
        endDate: data.isActive ? null : data.endDate,
        isActive: data.isActive,
      };

      const url = editing
        ? `${API_URL}/api/medicines/${editing._id}`
        : `${API_URL}/api/medicines`;

      const method = editing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(medicineData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Failed to save medicine.");
      }

      setEditing(null);
      await fetchMeds();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to save medicine.");
    } finally {
      setLoading(false);
    }
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
    <div className="container page">
      {/* Header */}
      <section className="page-header">
        <div>
          <div className="flex items-center gap-3">
            <div className="icon-wrapper">
              <Pill size={24} className="text-blue-600" />
            </div>

            <h1 className="page-title">Medicines</h1>
          </div>

          <p className="mt-3 text-slate-600">
            Manage your medications, dosage schedules, and treatment
            information.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Medicine List */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-title">My Medicines</h2>

            <span className="badge">{meds.length} Total</span>
          </div>

          <MedicineList
            medicines={meds}
            onEdit={setEditing}
            onDelete={deleteMedicine}
          />
        </div>

        {/* Form */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <PlusCircle size={22} className="text-blue-600" />

            <h2 className="section-title">
              {editing ? "Edit Medicine" : "Add Medicine"}
            </h2>
          </div>

          <MedicineForm
            onSave={saveMedicine}
            editing={editing}
            onCancel={() => setEditing(null)}
            loading={loading}
          />
        </div>
      </section>
    </div>
  );
}
