// client/src/context/MedicineContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const MedicineContext = createContext();

export function MedicineProvider({ children }) {
  const [medicines, setMedicines] = useState([]);
  const token = localStorage.getItem("token");

  const fetchMedicines = async () => {
    if (!token) return;

    const res = await fetch("http://localhost:5000/api/medicines", {
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
