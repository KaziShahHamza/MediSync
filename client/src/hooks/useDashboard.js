import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function useDashboard() {
  const [data, setData] = useState(null);

  const [aiSummary, setAiSummary] = useState(null);
  const [aiGeneratedAt, setAiGeneratedAt] = useState(null);
  const [aiLoading, setAiLoading] = useState(true);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiMessage, setAiMessage] = useState("");

  const [pdfLoading, setPdfLoading] = useState(false);

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_URL}/api/dashboard`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load dashboard");
        }

        return res.json();
      })
      .then((result) => {
        setData(result);
      })
      .catch((err) => {
        console.error("Dashboard loading failed:", err);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_URL}/api/ai/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load AI summary");
        }

        return res.json();
      })
      .then((result) => {
        setAiSummary(result.summary);
        setAiGeneratedAt(result.generatedAt);
        setAiMessage(result.message || "");
      })
      .catch((err) => {
        console.error("AI summary loading failed:", err);

        setAiMessage("Unable to load the AI health summary right now.");
      })
      .finally(() => {
        setAiLoading(false);
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleGenerateSummary = async () => {
    const token = localStorage.getItem("token");

    setAiGenerating(true);
    setAiMessage("");

    try {
      const response = await fetch(`${API_URL}/api/ai/summary/generate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to generate summary");
      }

      setAiSummary(result.summary);
      setAiGeneratedAt(result.generatedAt);
      setAiMessage("");
    } catch (err) {
      console.error("AI summary generation failed:", err);

      setAiMessage(err.message || "Failed to generate AI summary.");
    } finally {
      setAiGenerating(false);
    }
  };

  const handleExportPDF = async () => {
    const token = localStorage.getItem("token");

    setPdfLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/export/health-report`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const result = await response.json().catch(() => null);

        throw new Error(result?.message || "Failed to generate PDF report");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `MediSync-Health-Report-${
        new Date().toISOString().split("T")[0]
      }.pdf`;

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF export failed:", err);

      alert(err.message || "Failed to export health report. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  };

  const greeting =
    time.getHours() < 12
      ? "Morning"
      : time.getHours() < 18
        ? "Afternoon"
        : "Evening";

  return {
    data,

    aiSummary,
    aiGeneratedAt,
    aiLoading,
    aiGenerating,
    aiMessage,

    pdfLoading,

    time,
    greeting,

    handleGenerateSummary,
    handleExportPDF,
  };
}
