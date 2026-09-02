// client/src/context/MedicineContext.

import { createContext, useContext, useEffect, useState } from "react";

const MedicineContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export function MedicineProvider({ children }) {
  const [medicines, setMedicines] = useState([]);
  const token = localStorage.getItem("token");

  const fetchMedicines = async () => {
    if (!token) return;

    const res = await fetch(`${API_URL}/api/medicines`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setMedicines(await res.json());
  };

  useEffect(() => {
    fetchMedicines();
  }, [token]);

  return (
    <MedicineContext.Provider
      value={{ medicines, setMedicines, fetchMedicines }}
    >
      {children}
    </MedicineContext.Provider>
  );
}

export const useMedicines = () => useContext(MedicineContext);
