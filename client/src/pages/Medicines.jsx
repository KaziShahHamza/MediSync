import { useEffect, useState } from "react";
import { Pill, PlusCircle } from "lucide-react";

import MedicineForm from "../components/MedicineForm";
import MedicineList from "../components/MedicineList";
import MedicineMonthlyCost from "../components/MedicineMonthlyCost";

const API_URL = import.meta.env.VITE_API_URL;

const CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

const UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

export default function Dashboard() {
  const [meds, setMeds] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  /*
   * ========================================================
   * FETCH MEDICINES
   * ========================================================
   */

  const fetchMeds = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/medicines`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch medicines.",
        );
      }

      setMeds(
        Array.isArray(data) ? data : [],
      );
    } catch (error) {
      console.error(
        "Failed to fetch medicines:",
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeds();
  }, []);

  /*
   * ========================================================
   * SAVE MEDICINE
   * ========================================================
   */

  const saveMedicine = async (data) => {
    setLoading(true);

    try {
      let imageUrl = data.imageUrl || "";

      /*
       * ------------------------------------------------------
       * Upload new image to Cloudinary
       * ------------------------------------------------------
       */

      if (data.imageFile) {
        const formData = new FormData();

        formData.append(
          "file",
          data.imageFile,
        );

        formData.append(
          "upload_preset",
          UPLOAD_PRESET,
        );

        const uploadResponse =
          await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
              method: "POST",
              body: formData,
            },
          );

        const uploadData =
          await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(
            uploadData.error?.message ||
              "Failed to upload medicine image.",
          );
        }

        imageUrl =
          uploadData.secure_url || "";
      }

      /*
       * ------------------------------------------------------
       * Build medicine payload
       * ------------------------------------------------------
       *
       * Only send the pricing fields that belong to the
       * selected pricing type.
       */

      const medicineData = {
        name: data.name,
        type: data.type,
        pricingType: data.pricingType,

        dosage:
          data.pricingType === "strip"
            ? data.dosage
            : [],

        pricePerStrip:
          data.pricingType === "strip"
            ? Number(data.pricePerStrip)
            : null,

        piecesPerStrip:
          data.pricingType === "strip"
            ? Number(data.piecesPerStrip)
            : null,

        pricePerUnit:
          data.pricingType === "unit"
            ? Number(data.pricePerUnit)
            : null,

        unitsPerMonth:
          data.pricingType === "unit"
            ? Number(data.unitsPerMonth)
            : null,

        imageUrl,

        startDate: data.startDate,

        endDate: data.isActive
          ? null
          : data.endDate,

        isActive: data.isActive,
      };

      /*
       * ------------------------------------------------------
       * Create / update
       * ------------------------------------------------------
       */

      const url = editing
        ? `${API_URL}/api/medicines/${editing._id}`
        : `${API_URL}/api/medicines`;

      const method = editing
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type":
            "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(
          medicineData,
        ),
      });

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to save medicine.",
        );
      }

      /*
       * Refresh list after save.
       */

      await fetchMeds();

      setEditing(null);
    } catch (error) {
      console.error(
        "Failed to save medicine:",
        error,
      );

      throw error;
    } finally {
      setLoading(false);
    }
  };

  /*
   * ========================================================
   * DELETE
   * ========================================================
   */

  const deleteMedicine = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this medicine?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/medicines/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete medicine.",
        );
      }

      setMeds((previous) =>
        previous.filter(
          (medicine) =>
            medicine._id !== id,
        ),
      );

      /*
       * If the deleted medicine was being
       * edited, close the form.
       */

      if (editing?._id === id) {
        setEditing(null);
      }
    } catch (error) {
      console.error(
        "Failed to delete medicine:",
        error,
      );

      window.alert(
        error.message ||
          "Failed to delete medicine.",
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * ========================================================
   * EDIT
   * ========================================================
   */

  const handleEdit = (medicine) => {
    setEditing(medicine);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /*
   * ========================================================
   * CANCEL EDIT
   * ========================================================
   */

  const handleCancelEdit = () => {
    setEditing(null);
  };

  /*
   * ========================================================
   * RENDER
   * ========================================================
   */

  return (
    <div className="container page">
      {/* PAGE HEADER */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Pill size={22} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Medicines
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage your medicines,
                dosage and monthly costs.
              </p>
            </div>
          </div>
        </div>

        {!editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(null);

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            <PlusCircle size={18} />
            Add medicine
          </button>
        )}
      </div>

      {/* CONTENT */}

      <section className="grid items-start gap-8 lg:grid-cols-2">
        {/* LEFT */}

        <div>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="section-title">
              My Medicines
            </h2>

            <span className="text-sm text-slate-500">
              {meds.length} Total
            </span>
          </div>

          {/* MONTHLY COST */}

          <div className="mb-5">
            <MedicineMonthlyCost
              medicines={meds}
            />
          </div>

          {/* MEDICINE LIST */}

          <MedicineList
            medicines={meds}
            onEdit={handleEdit}
            onDelete={deleteMedicine}
            loading={loading}
          />
        </div>

        {/* RIGHT */}

        <div>
          <MedicineForm
            onSave={saveMedicine}
            editing={editing}
            onCancel={handleCancelEdit}
            loading={loading}
          />
        </div>
      </section>
    </div>
  );
}