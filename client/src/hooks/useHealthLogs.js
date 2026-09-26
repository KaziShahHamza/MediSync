// client/src/hooks/useHealthLogs.js

// Fetches authenticated health logs and provides health-log creation.
// Keeps health API communication and loading data synchronized in one hook.

import { useCallback, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function useHealthLogs() {
  const [logs, setLogs] = useState([]);

  // Fetch the authenticated user's health logs.
  const fetchLogs = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLogs([]);
      return;
    }

    const response = await fetch(`${API_URL}/api/health`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json().catch(() => []);

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch health logs.");
    }

    setLogs(Array.isArray(data) ? data : data.logs || []);
  }, []);

  // Create a new health log and refresh the local collection.
  const addLog = useCallback(
    async (data) => {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication is required.");
      }

      const response = await fetch(`${API_URL}/api/health`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Failed to save health log.");
      }

      await fetchLogs();

      return result;
    },
    [fetchLogs],
  );

  // Load health logs when the hook is mounted.
  useEffect(() => {
    fetchLogs().catch((error) => {
      console.error("Failed to fetch health logs:", error);
    });
  }, [fetchLogs]);

  return {
    logs,
    addLog,
    fetchLogs,
  };
}
