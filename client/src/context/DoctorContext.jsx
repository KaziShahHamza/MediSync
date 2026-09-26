// client/src/context/DoctorContext.jsx

// Provides global doctor data and doctor API access.
// Loads the authenticated user's doctors and exposes shared state.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DoctorContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL;

export function DoctorProvider({ children }) {
  const [doctors, setDoctors] = useState([]);

  // Fetches the authenticated user's doctors from the backend.
  const fetchDoctors = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setDoctors([]);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/doctors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch doctors.");
      }

      setDoctors(data);
    } catch (error) {
      console.error("Fetch doctors error:", error);
    }
  }, []);

  // Loads doctors when the provider is mounted.
  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // Exposes doctor state and refresh operations to consumers.
  return (
    <DoctorContext.Provider
      value={{
        doctors,
        setDoctors,
        fetchDoctors,
      }}
    >
      {children}
    </DoctorContext.Provider>
  );
}

export function useDoctors() {
  const context = useContext(DoctorContext);

  if (!context) {
    throw new Error("useDoctors must be used inside DoctorProvider");
  }

  return context;
}
