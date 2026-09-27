// client/src/hooks/useHealthLogs.js

// Fetches authenticated health logs and provides health-log creation.
// Keeps health API communication and loading data synchronized in one hook.

import { useCallback, useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function useHealthLogs() {
  const [logs, setLogs] = useState([]);

  const fetchLogs = useCallback(async () => {
    // Read the current authentication token before making the request.
    const token = localStorage.getItem("token");

    if (!token) {
      setLogs([]);
      return;
    }

    // Request the authenticated user's health records.
    const response = await fetch(`${API_URL}/api/health`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json().catch(() => []);

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch health logs.");
    }

    // Normalize both array and wrapped API response formats.
    setLogs(Array.isArray(data) ? data : data.logs || []);
  }, []);

  const addLog = useCallback(
    async (data) => {
      // Require authentication before creating a health record.
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

      // Refresh the local collection after successfully saving the log.
      await fetchLogs();

      return result;
    },
    [fetchLogs],
  );

  useEffect(() => {
    let cancelled = false;

    async function loadHealthLogs() {
      // Read authentication state when the initial request starts.
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      try {
        // Keep the initial fetch asynchronous so the effect does not
        // synchronously trigger the state-changing fetchLogs callback.
        const response = await fetch(`${API_URL}/api/health`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json().catch(() => []);

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch health logs.");
        }

        // Ignore responses that finish after the hook has unmounted.
        if (!cancelled) {
          setLogs(Array.isArray(data) ? data : data.logs || []);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to fetch health logs:", error);
        }
      }
    }

    loadHealthLogs();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    logs,
    addLog,
    fetchLogs,
  };
}
