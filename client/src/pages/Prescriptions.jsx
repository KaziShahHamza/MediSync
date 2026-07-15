import { useState } from "react";
import { usePrescriptions } from "../context/PrescriptionContext";
import PrescriptionCard from "../components/PrescriptionCard";

const CLOUD_NAME = "bvwcgvwv";
const UPLOAD_PRESET = "new_preset";

export default function Prescriptions() {
  const {
    prescriptions,
    fetchPrescriptions,
  } = usePrescriptions();

  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!title || !file) {
      alert("Select image and title.");
      return;
    }

    setLoading(true);

    try {
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadData = await uploadRes.json();

      // Save URL to backend
      const token = localStorage.getItem("token");

      await fetch("http://localhost:5000/api/prescriptions", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          title,
          imageUrl: uploadData.secure_url,
        }),
      });

      setTitle("");
      setFile(null);

      fetchPrescriptions();
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    }

    setLoading(false);
  }

  async function deletePrescription(id) {
    if (!window.confirm("Delete prescription?")) return;

    const token = localStorage.getItem("token");

    await fetch(
      `http://localhost:5000/api/prescriptions/${id}`,
      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchPrescriptions();
  }

  return (
    <div className="container py-8">

      <h1 className="text-3xl font-bold mb-8">
        Prescriptions
      </h1>

      {/* Upload */}

      <div className="card p-6 mb-8">

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input w-full mb-4"
        />

        <input
          type="file"
          accept="image/png,image/jpeg"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />

        <button
          onClick={handleUpload}
          className="btn-primary"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

      </div>

      {/* Grid */}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {prescriptions.map((item) => (
          <PrescriptionCard
            key={item._id}
            prescription={item}
            onOpen={setSelected}
            onDelete={deletePrescription}
          />
        ))}

      </div>

      {/* Preview */}

      {selected && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-w-5xl max-h-[90vh] p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selected.imageUrl}
              alt={selected.title}
              className="max-h-[80vh] rounded-lg"
            />

            <div className="flex justify-between mt-4 text-white">

              <h2 className="text-xl font-semibold">
                {selected.title}
              </h2>

              <button
                onClick={() => setSelected(null)}
              >
                Close
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}