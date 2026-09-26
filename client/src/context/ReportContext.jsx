// client/src/context/ReportContext.jsx

// Provides medical report records and report API operations.
// Keeps report state available across protected application pages.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const ReportContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL;

// Provides report state and backend report operations.
export function ReportProvider({ children }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  // Retrieves the current authentication token.
  const getToken = () => localStorage.getItem("token");

  // Fetches reports belonging to the authenticated user.
  const fetchReports = useCallback(async () => {
    const token = getToken();

    if (!token) {
      setReports([]);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/reports`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch reports.");
      }

      setReports(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, []);

  // Loads reports automatically when the provider mounts.
  useEffect(() => {
    fetchReports().catch((error) => {
      console.error("Failed to fetch reports:", error);
    });
  }, [fetchReports]);

  return (
    <ReportContext.Provider
      value={{
        reports,
        setReports,
        loading,
        fetchReports,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
}

// Provides safe access to report context state.
export function useReports() {
  const context = useContext(ReportContext);

  if (!context) {
    throw new Error("useReports must be used within a ReportProvider.");
  }

  return context;
}
