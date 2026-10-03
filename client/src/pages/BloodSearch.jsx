// client/src/pages/BloodSearch.jsx

// Renders the blood donor search page.
// Connects donor search state, filters, pagination, and result components.

import { Droplets } from "lucide-react";

import BloodSearchForm from "../components/blood/find-donor/BloodSearchForm";
import DonorResults from "../components/blood/find-donor/DonorResults";

import useBloodSearch from "../hooks/useBloodSearch";

// Provides donor search, pagination, and result display functionality.
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
    totalDonors,
    loading,
    searched,
    error,
    upazilas,
    currentPage,
    totalPages,
    handleSearch,
    handleReset,
    handlePageChange,
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

      {/* Displays matching donor results and pagination. */}
      <DonorResults
        donors={donors}
        totalDonors={totalDonors}
        searched={searched}
        loading={loading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </main>
  );
}
