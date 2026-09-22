// client/src/context/LifestyleContext.jsx

// React context providing global state and API interactions for lifestyle assessments.
// Fetches existing history, posts new submissions, and exposes state hooks.

import { createContext, useContext, useEffect, useState } from "react";

import { useAuth } from "./AuthContext";

const LifestyleContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL;

// Context provider component
export function LifestyleProvider({ children }) {
  const { user } = useAuth();

  const [assessments, setAssessments] = useState([]);
  const [latestAssessment, setLatestAssessment] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Gets JWT authorization header from local storage
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : null;
  };

  // Fetches user assessment history from API
  const fetchAssessments = async () => {
    const headers = getAuthHeaders();

    if (!user || !headers) {
      setAssessments([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/lifestyle`, {
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load lifestyle assessments");
      }

      setAssessments(data.assessments || []);
    } catch (err) {
      console.error("Fetch lifestyle assessments error:", err);

      setError(err.message || "Failed to load lifestyle assessments");
    } finally {
      setLoading(false);
    }
  };

  // Fetches single most recent assessment from API
  const fetchLatestAssessment = async () => {
    const headers = getAuthHeaders();

    if (!user || !headers) {
      setLatestAssessment(null);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/lifestyle/latest`, {
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load latest lifestyle assessment",
        );
      }

      setLatestAssessment(data.assessment || null);
    } catch (err) {
      console.error("Fetch latest lifestyle assessment error:", err);

      setError(err.message || "Failed to load latest lifestyle assessment");
    } finally {
      setLoading(false);
    }
  };

  // Persists submitted assessment answers to server
  const saveAssessment = async (answers) => {
    const headers = getAuthHeaders();

    if (!user || !headers) {
      throw new Error("Please log in to save your lifestyle assessment.");
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(`${API_URL}/api/lifestyle`, {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          answers,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save lifestyle assessment");
      }

      const savedAssessment = data.assessment;

      setLatestAssessment(savedAssessment);

      setAssessments((previousAssessments) => {
        const updatedAssessments = [
          savedAssessment,
          ...previousAssessments.filter(
            (assessment) => assessment._id !== savedAssessment._id,
          ),
        ];

        return updatedAssessments.slice(0, 10);
      });

      return savedAssessment;
    } catch (err) {
      console.error("Save lifestyle assessment error:", err);

      setError(err.message || "Failed to save lifestyle assessment");

      throw err;
    } finally {
      setSaving(false);
    }
  };

  // Synchronize state when authentication status changes
  useEffect(() => {
    if (!user) {
      setAssessments([]);
      setLatestAssessment(null);
      setError("");
      return;
    }

    fetchAssessments();
    fetchLatestAssessment();
  }, [user]);

  const value = {
    assessments,
    latestAssessment,
    loading,
    saving,
    error,

    saveAssessment,
    fetchAssessments,
    fetchLatestAssessment,
  };

  return (
    <LifestyleContext.Provider value={value}>
      {children}
    </LifestyleContext.Provider>
  );
}

// Hook to consume lifestyle context
export function useLifestyle() {
  const context = useContext(LifestyleContext);

  if (!context) {
    throw new Error("useLifestyle must be used inside a LifestyleProvider");
  }

  return context;
}
