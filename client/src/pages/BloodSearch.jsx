// client/src/pages/BloodSearch.jsx

// Renders the blood donor search page.
// Connects donor search state and filters to the search components.

import { Droplets } from "lucide-react";

import BloodSearchForm from "../components/blood/BloodSearchForm";
import DonorResults from "../components/blood/DonorResults";

import useBloodSearch from "../hooks/useBloodSearch";

// Provides donor search and result display functionality.
export default function BloodSearch() {
  const {
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
  } = useBloodSearch();

  return (
    <main className="container py-10 lg:py-14">
      {/* Page heading and donor search introduction. */}
      <div className="page-header">
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
          <Droplets size={25} strokeWidth={2} />
        </div>

        <h1 className="page-title">Blood Search</h1>

        <p className="page-description max-w-2xl">
          Find available blood donors by blood group and location.
        </p>
      </div>

      {/* Provides donor search filters and actions. */}
      <BloodSearchForm
        bloodGroup={bloodGroup}
        setBloodGroup={setBloodGroup}
        district={district}
        setDistrict={setDistrict}
        upazila={upazila}
        setUpazila={setUpazila}
        compensation={compensation}
        setCompensation={setCompensation}
        upazilas={upazilas}
        loading={loading}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {/* Displays search errors. */}
      {error && <div className="alert alert-danger mb-8">{error}</div>}

      {/* Displays matching donor results. */}
      <DonorResults
        donors={donors}
        searched={searched}
        loading={loading}
        error={error}
      />
    </main>
  );
}
