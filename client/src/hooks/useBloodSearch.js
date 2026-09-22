// client/src/hooks/useBloodSearch.js

import { useEffect, useMemo, useState } from "react";

import { districtsData } from "../data/districtsData";

const API_URL = import.meta.env.VITE_API_URL;

// Custom hook to handle donor search filters, API requests, and result states
export default function useBloodSearch() {
  const [bloodGroup, setBloodGroup] = useState("");

  const [district, setDistrict] = useState("");

  const [upazila, setUpazila] = useState("");

  const [compensation, setCompensation] = useState("");

  const [donors, setDonors] = useState([]);

  const [loading, setLoading] = useState(false);

  const [searched, setSearched] = useState(false);

  const [error, setError] = useState("");

  // Retrieves selected district object matching current selection
  const selectedDistrict = useMemo(
    () => districtsData.find((item) => item.name === district),
    [district],
  );

  const upazilas = selectedDistrict?.upazilas || [];

  // Resets upazila filter whenever district value changes
  useEffect(() => {
    setUpazila("");
  }, [district]);

  // Fetches blood donors from API matching set filter criteria
  const fetchDonors = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      // Constructs query parameters from non-empty filter values
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

      if (!response.ok) {
        throw new Error("Failed to find blood donors.");
      }

      const data = await response.json();

      setDonors(data.donors || []);

      setSearched(true);
    } catch (err) {
      console.error("Blood donor search failed:", err);

      setDonors([]);

      setError(err.message || "Unable to search for blood donors.");
    } finally {
      setLoading(false);
    }
  };

  // Form submission handler to execute donor query
  const handleSearch = (event) => {
    event.preventDefault();

    fetchDonors();
  };

  // Clears all search filter parameters and search results
  const handleReset = () => {
    setBloodGroup("");
    setDistrict("");
    setUpazila("");
    setCompensation("");
    setDonors([]);
    setError("");
    setSearched(false);
  };

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
