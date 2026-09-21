import { Droplets } from "lucide-react";

import BloodSearchForm from "../components/blood/BloodSearchForm";
import DonorResults from "../components/blood/DonorResults";

import useBloodSearch from "../hooks/useBloodSearch";

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
      {/* ====================================================
          Page Header
      ==================================================== */}

      <div className="page-header">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-sky-50 text-sky-600 mb-4">
          <Droplets size={25} strokeWidth={2} />
        </div>

        <h1 className="page-title">Blood Search</h1>

        <p className="page-description max-w-2xl">
          Find available blood donors by blood group and location.
        </p>
      </div>

      {/* ====================================================
          Donor Search
      ==================================================== */}

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

      {/* ====================================================
          Error
      ==================================================== */}

      {error && <div className="alert alert-danger mb-8">{error}</div>}

      {/* ====================================================
          Donor Results
      ==================================================== */}

      <DonorResults
        donors={donors}
        searched={searched}
        loading={loading}
        error={error}
      />
    </main>
  );
}
