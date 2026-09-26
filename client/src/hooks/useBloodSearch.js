// client/src/hooks/useBloodSearch.js

// Manages donor search filters, location dependencies, API requests, and result states.
// Provides reusable search and reset actions for the blood donor page.

import { useCallback, useEffect, useMemo, useState } from "react";

import { districtsData } from "../data/districtsData";

const API_URL = import.meta.env.VITE_API_URL;

export default function useBloodSearch() {
  // Store donor search filters and result state.
  const [bloodGroup, setBloodGroup] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [compensation, setCompensation] = useState("");

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  // Find the selected district and its available upazilas.
  const selectedDistrict = useMemo(
    () => districtsData.find((item) => item.name === district),
    [district],
  );

  const upazilas = selectedDistrict?.upazilas || [];

  // Reset the upazila when its parent district changes.
  useEffect(() => {
    setUpazila("");
  }, [district]);

  // Fetch donors using the currently selected search filters.
  const fetchDonors = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      // Add only active filters to the request query.
      if (bloodGroup) {
        params.set("bloodGroup", bloodGroup);
      }

      if (district) {
        params.set("district", district);
      }

      if (upazila) {
        params.set("upazila", upazila);
      }

      if (compensation) {
        params.set("compensation", compensation);
      }

      const queryString = params.toString();

      const url = queryString
        ? `${API_URL}/api/blood/donors?${queryString}`
        : `${API_URL}/api/blood/donors`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to find blood donors.");
      }

      setDonors(Array.isArray(data.donors) ? data.donors : []);
      setSearched(true);
    } catch (err) {
      console.error("Blood donor search failed:", err);

      setDonors([]);
      setError(err.message || "Unable to search for blood donors.");
    } finally {
      setLoading(false);
    }
  }, [bloodGroup, district, upazila, compensation]);

  // Prevent the search form from performing a browser submission.
  function handleSearch(event) {
    event.preventDefault();

    fetchDonors();
  }

  // Clears all filters, results, and search feedback.
  function handleReset() {
    setBloodGroup("");
    setDistrict("");
    setUpazila("");
    setCompensation("");
    setDonors([]);
    setError("");
    setSearched(false);
  }

  return {
    bloodGroup,
    setBloodGroup,

    district,
    setDistrict,

    upazila,
    setUpazila,

    compensation,
    setCompensation,

    donors,
    loading,
    searched,
    error,

    upazilas,

    handleSearch,
    handleReset,
  };
}
