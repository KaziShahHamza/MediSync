// client/src/context/MedicineContext.jsx

// Provides medicine state and API operations for authenticated users.
// Handles medicine CRUD operations and Cloudinary image uploads.

import { createContext, useCallback, useEffect, useState } from "react";

const MedicineContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL;
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// Provides medicine data and operations to child components.
export function MedicineProvider({ children }) {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);

  // Retrieves the current authentication token.
  const getToken = () => localStorage.getItem("token");

  // Fetches all medicines belonging to the authenticated user.
  const fetchMedicines = useCallback(async () => {
    const token = getToken();

    if (!token) {
      setMedicines([]);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/medicines`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch medicines.");
      }

      setMedicines(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  // Uploads a medicine image directly to Cloudinary.
  async function uploadMedicineImage(file) {
    if (!file) {
      return null;
    }

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      throw new Error("Cloudinary configuration is missing.");
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data?.error?.message || "Failed to upload medicine image.",
      );
    }

    return data.secure_url;
  }

  // Saves a new or existing medicine using the appropriate API method.
  async function saveMedicine(medicineData) {
    const token = getToken();

    if (!token) {
      throw new Error("You must be logged in to save a medicine.");
    }

    setLoading(true);

    try {
      let imageUrl = medicineData.imageUrl || "";

      if (medicineData.imageFile) {
        imageUrl = await uploadMedicineImage(medicineData.imageFile);
      }

      const isStrip = medicineData.pricingType === "strip";

      // Builds the backend payload according to pricing type.
      const payload = {
        name: medicineData.name,
        type: medicineData.type,
        pricingType: medicineData.pricingType,
        dosage: isStrip ? medicineData.dosage : [],
        pricePerStrip: isStrip ? medicineData.pricePerStrip : null,
        piecesPerStrip: isStrip ? medicineData.piecesPerStrip : null,
        pricePerUnit: isStrip ? null : medicineData.pricePerUnit,
        unitsPerMonth: isStrip ? null : medicineData.unitsPerMonth,
        imageUrl,
        startDate: medicineData.startDate,
        endDate: medicineData.isActive ? null : medicineData.endDate,
        isActive: medicineData.isActive,
      };

      const url = medicineData._id
        ? `${API_URL}/api/medicines/${medicineData._id}`
        : `${API_URL}/api/medicines`;

      const method = medicineData._id ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to save medicine.");
      }

      await fetchMedicines();

      return data;
    } finally {
      setLoading(false);
    }
  }

  // Creates a new medicine record.
  async function createMedicine(medicineData) {
    return saveMedicine(medicineData);
  }

  // Updates an existing medicine record.
  async function updateMedicine(id, medicineData) {
    return saveMedicine({
      ...medicineData,
      _id: id,
    });
  }

  // Deletes a medicine and removes it from local state.
  async function deleteMedicine(id) {
    const token = getToken();

    if (!token) {
      throw new Error("You must be logged in to delete a medicine.");
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/medicines/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to delete medicine.");
      }

      setMedicines((current) =>
        current.filter((medicine) => medicine._id !== id),
      );

      return data;
    } finally {
      setLoading(false);
    }
  }

  // Loads medicines automatically when the provider mounts.
  useEffect(() => {
    fetchMedicines().catch((error) => {
      console.error("Failed to fetch medicines:", error);
    });
  }, [fetchMedicines]);

  return (
    <MedicineContext.Provider
      value={{
        medicines,
        setMedicines,
        loading,
        fetchMedicines,
        createMedicine,
        updateMedicine,
        deleteMedicine,
      }}
    >
      {children}
    </MedicineContext.Provider>
  );
}

export { MedicineContext };
