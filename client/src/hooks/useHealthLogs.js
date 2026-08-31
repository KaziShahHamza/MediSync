// client/src/hooks/useHealthLogs.js
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function useHealthLogs() {
  const [logs, setLogs] = useState([]);
  const token = localStorage.getItem("token");

  const fetchLogs = async () => {
    const res = await fetch(`${API_URL}/api/health`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setLogs(await res.json());
  };

  const addLog = async (data) => {
    const res = await fetch(`${API_URL}/api/health`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to save health log");
    }

    await fetchLogs();

    return result;
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return { logs, addLog };
}
