import { useEffect, useMemo, useState } from "react";

import { districtsData } from "../data/districtsData";

const API_URL = import.meta.env.VITE_API_URL;

export default function useBloodSearch() {
  // ========================================================
  // Search State
  // ========================================================

  const [bloodGroup, setBloodGroup] = useState("");

  const [district, setDistrict] = useState("");

  const [upazila, setUpazila] = useState("");

  const [compensation, setCompensation] = useState("");

  const [donors, setDonors] = useState([]);

  const [loading, setLoading] = useState(false);

  const [searched, setSearched] = useState(false);

  const [error, setError] = useState("");

  // ========================================================
  // Search Location
  // ========================================================

  const selectedDistrict = useMemo(
    () => districtsData.find((item) => item.name === district),
    [district],
  );

  const upazilas = selectedDistrict?.upazilas || [];

  // ========================================================
  // Reset Upazila When District Changes
  // ========================================================

  useEffect(() => {
    setUpazila("");
  }, [district]);

  // ========================================================
  // Donor Search
  // ========================================================

  const fetchDonors = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

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

  const handleSearch = (event) => {
    event.preventDefault();

    fetchDonors();
  };

  // ========================================================
  // Reset
  // ========================================================

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
