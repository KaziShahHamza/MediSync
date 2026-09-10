// client/src/context/ReportContext.jsx

import { createContext, useContext, useEffect, useState } from "react";

const ReportContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export function ReportProvider({ children }) {
  const [reports, setReports] = useState([]);

  const fetchReports = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/reports`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <ReportContext.Provider
      value={{
        reports,
        setReports,
        fetchReports,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
}

export function useReports() {
  return useContext(ReportContext);
}
