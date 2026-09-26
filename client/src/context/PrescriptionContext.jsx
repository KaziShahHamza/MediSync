// src/context/PrescriptionContext.jsx

// Provides prescription records and prescription API operations.
// Keeps prescription state synchronized with the backend.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const PrescriptionContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL;

// Provides prescription state and operations to child components.
export function PrescriptionProvider({ children }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Retrieves the current authentication token.
  const getToken = () => localStorage.getItem("token");

  // Fetches prescriptions belonging to the authenticated user.
  const fetchPrescriptions = useCallback(async () => {
    const token = getToken();

    if (!token) {
      setPrescriptions([]);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/prescriptions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch prescriptions.");
      }

      setPrescriptions(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  // Loads prescriptions automatically when the provider mounts.
  useEffect(() => {
    fetchPrescriptions().catch((error) => {
      console.error("Failed to fetch prescriptions:", error);
    });
  }, [fetchPrescriptions]);

  return (
    <PrescriptionContext.Provider
      value={{
        prescriptions,
        setPrescriptions,
        loading,
        fetchPrescriptions,
      }}
    >
      {children}
    </PrescriptionContext.Provider>
  );
}

// Provides safe access to prescription context state.
export function usePrescriptions() {
  const context = useContext(PrescriptionContext);

  if (!context) {
    throw new Error(
      "usePrescriptions must be used within a PrescriptionProvider.",
    );
  }

  return context;
}
