// client/src/components/blood/BloodSearchForm.jsx
// Form component for filtering blood donors by blood group, district, upazila, and travel allowance support.

import { RotateCcw, Search } from "lucide-react";

import { BLOOD_GROUPS } from "../../utils/blood/bloodConstants";

import { districtsData } from "../../data/districtsData";

// Search filter form component for finding blood donors
export default function BloodSearchForm({
  bloodGroup,
  setBloodGroup,

  district,
  setDistrict,

  upazila,
  setUpazila,

  compensation,
  setCompensation,

  upazilas,

  loading,

  onSearch,
  onReset,
}) {
  return (
    // Filter card container
    <section className="card p-6 lg:p-8 mb-8">
      {/* Form section header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
          <Search size={20} />
        </div>

        <div>
          <h2 className="card-title">Find a Blood Donor</h2>

          <p className="text-sm text-muted mt-1">
            Search by blood group, location, and compensation.
          </p>
        </div>
      </div>

      {/* Filter submission form */}
      <form onSubmit={onSearch}>
        {/* Input fields grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Blood group dropdown selector */}
          <div>
            <label htmlFor="blood-group" className="small-label block mb-2">
              Blood Group
            </label>

            <select
              id="blood-group"
              value={bloodGroup}
              onChange={(event) => setBloodGroup(event.target.value)}
              className="input"
            >
              <option value="">All blood groups</option>

              {BLOOD_GROUPS.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          {/* District dropdown selector */}
          <div>
            <label htmlFor="district" className="small-label block mb-2">
              District
            </label>

            <select
              id="district"
              value={district}
              onChange={(event) => setDistrict(event.target.value)}
              className="input"
            >
              <option value="">All districts</option>

              {districtsData.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Upazila dropdown selector */}
          <div>
            <label htmlFor="upazila" className="small-label block mb-2">
              Upazila
            </label>

            <select
              id="upazila"
              value={upazila}
              onChange={(event) => setUpazila(event.target.value)}
              disabled={!district}
              className="input disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="">
                {district ? "All upazilas" : "Select district first"}
              </option>

              {upazilas.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Compensation dropdown selector */}
          <div>
            <label htmlFor="compensation" className="small-label block mb-2">
              Will you Provide travel cost? (সম্মানী)
            </label>

            <select
              id="compensation"
              value={compensation}
              onChange={(event) => setCompensation(event.target.value)}
              className="input"
            >
              <option value="">Any</option>

              <option value="yes">Yes</option>

              <option value="no">No</option>
            </select>
          </div>
        </div>

        {/* Form control buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          {/* Submit search button */}
          <button type="submit" className="btn-primary" disabled={loading}>
            <Search size={17} />

            {loading ? "Searching..." : "Find Donors"}
          </button>

          {/* Reset form button */}
          <button
            type="button"
            onClick={onReset}
            className="btn-secondary"
            disabled={loading}
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </form>
    </section>
  );
}
