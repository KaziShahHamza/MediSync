// src/context/DoctorContext.jsx

import { createContext, useContext, useEffect, useState } from "react";

const DoctorContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export function DoctorProvider({ children }) {
  const [doctors, setDoctors] = useState([]);

  async function fetchDoctors() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/doctors`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchDoctors();
  }, []);

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
  return useContext(DoctorContext);
}
