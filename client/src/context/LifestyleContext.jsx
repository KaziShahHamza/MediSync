// client/src/context/LifestyleContext.jsx

// Provides global lifestyle assessment state and API operations.
// Manages assessment history, latest results, saving, loading, and errors.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

const LifestyleContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL;

export function LifestyleProvider({ children }) {
  const { user } = useAuth();

  const [assessments, setAssessments] = useState([]);
  const [latestAssessment, setLatestAssessment] = useState(null);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function getAuthHeaders() {
    const token = localStorage.getItem("token");

    return token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : null;
  }

  // Fetches assessment history from the authenticated lifestyle endpoint.
  const fetchAssessments = useCallback(async () => {
    const headers = getAuthHeaders();

    if (!user || !headers) {
      setAssessments([]);
      return [];
    }

    try {
      const response = await fetch(`${API_URL}/api/lifestyle`, {
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load lifestyle assessments");
      }

      setAssessments(data.assessments || []);

      return data.assessments || [];
    } catch (error) {
      console.error("Fetch lifestyle assessments error:", error);

      setError(error.message || "Failed to load lifestyle assessments");

      return [];
    }
  }, [user]);

  // Fetches the most recent lifestyle assessment for the user.
  const fetchLatestAssessment = useCallback(async () => {
    const headers = getAuthHeaders();

    if (!user || !headers) {
      setLatestAssessment(null);
      return null;
    }

    try {
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

      return data.assessment || null;
    } catch (error) {
      console.error("Fetch latest lifestyle assessment error:", error);

      setError(error.message || "Failed to load latest lifestyle assessment");

      return null;
    }
  }, [user]);

  // Saves a new assessment and updates both local assessment states.
  const saveAssessment = useCallback(
    async (answers) => {
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
          throw new Error(
            data.message || "Failed to save lifestyle assessment",
          );
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
      } catch (error) {
        console.error("Save lifestyle assessment error:", error);

        setError(error.message || "Failed to save lifestyle assessment");

        throw error;
      } finally {
        setSaving(false);
      }
    },
    [user],
  );

  // Loads both history and latest assessment when authentication changes.
  useEffect(() => {
    if (!user) {
      setAssessments([]);
      setLatestAssessment(null);
      setError("");
      return;
    }

    let active = true;

    const loadLifestyleData = async () => {
      try {
        setLoading(true);
        setError("");

        await Promise.all([fetchAssessments(), fetchLatestAssessment()]);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadLifestyleData();

    return () => {
      active = false;
    };
  }, [user, fetchAssessments, fetchLatestAssessment]);

  // Exposes lifestyle state and API operations through the context.
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

export function useLifestyle() {
  const context = useContext(LifestyleContext);

  if (!context) {
    throw new Error("useLifestyle must be used inside a LifestyleProvider");
  }

  return context;
}
