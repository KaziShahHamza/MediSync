// src/context/PrescriptionContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const PrescriptionContext = createContext();

export function PrescriptionProvider({ children }) {
  const [prescriptions, setPrescriptions] = useState([]);

  const fetchPrescriptions = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:5000/api/prescriptions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setPrescriptions(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  return (
    <PrescriptionContext.Provider
      value={{
        prescriptions,
        setPrescriptions,
        fetchPrescriptions,
      }}
    >
      {children}
    </PrescriptionContext.Provider>
  );
}

export function usePrescriptions() {
  return useContext(PrescriptionContext);
}