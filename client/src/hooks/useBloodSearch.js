// client/src/hooks/useBloodSearch.js

// Manages donor search filters, location dependencies, API requests, and pagination.
// Provides reusable search, reset, and paginated donor result actions.

import { useCallback, useEffect, useState } from "react";

import { districtsData } from "../data/districtsData";

const API_URL = import.meta.env.VITE_API_URL;
const DONORS_PER_PAGE = 20;

export default function useBloodSearch() {
  // Store donor search filters and result state.
  const [bloodGroup, setBloodGroup] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [compensation, setCompensation] = useState("");

  const [donors, setDonors] = useState([]);
  const [totalDonors, setTotalDonors] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  // Find the selected district and its available upazilas.
  const selectedDistrict = districtsData.find((item) => item.name === district);

  const upazilas = selectedDistrict?.upazilas || [];

  // Reset the upazila when its parent district changes.
  useEffect(() => {
    setUpazila("");
  }, [district]);

  // Fetch donors using the supplied filters and page.
  const fetchDonors = useCallback(
    async ({
      page = 1,
      searchBloodGroup = bloodGroup,
      searchDistrict = district,
      searchUpazila = upazila,
      searchCompensation = compensation,
    } = {}) => {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        // Add only active filters to the request query.
        if (searchBloodGroup) {
          params.set("bloodGroup", searchBloodGroup);
        }

        if (searchDistrict) {
          params.set("district", searchDistrict);
        }

        if (searchUpazila) {
          params.set("upazila", searchUpazila);
        }

        if (searchCompensation) {
          params.set("compensation", searchCompensation);
        }

        params.set("page", page);
        params.set("limit", DONORS_PER_PAGE);

        const url = `${API_URL}/api/blood/donors?${params.toString()}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to find blood donors.");
        }

        setDonors(Array.isArray(data.donors) ? data.donors : []);

        setTotalDonors(data.pagination?.totalDonors || 0);

        setCurrentPage(data.pagination?.currentPage || page);

        setTotalPages(data.pagination?.totalPages || 1);

        setSearched(true);
      } catch (err) {
        console.error("Blood donor search failed:", err);

        setDonors([]);
        setTotalDonors(0);
        setCurrentPage(1);
        setTotalPages(1);
        setError(err.message || "Unable to search for blood donors.");
      } finally {
        setLoading(false);
      }
    },
    [bloodGroup, district, upazila, compensation],
  );

  // Load the first donor page automatically when the page is opened.
  useEffect(() => {
    fetchDonors({ page: 1 });
  }, []);

  // Prevent the search form from performing a browser submission.
  function handleSearch(event) {
    event.preventDefault();

    fetchDonors({ page: 1 });
  }

  // Change the currently visible donor page.
  function handlePageChange(page) {
    if (loading || page < 1 || page > totalPages || page === currentPage) {
      return;
    }

    fetchDonors({ page });
  }

  // Clear filters and reload the default unfiltered donor list.
  function handleReset() {
    setBloodGroup("");
    setDistrict("");
    setUpazila("");
    setCompensation("");

    fetchDonors({
      page: 1,
      searchBloodGroup: "",
      searchDistrict: "",
      searchUpazila: "",
      searchCompensation: "",
    });
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
    totalDonors,

    loading,
    searched,
    error,

    currentPage,
    totalPages,

    upazilas,

    handleSearch,
    handleReset,
    handlePageChange,
  };
}
