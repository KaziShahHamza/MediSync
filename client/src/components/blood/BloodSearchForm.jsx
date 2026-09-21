import { RotateCcw, Search } from "lucide-react";

import { BLOOD_GROUPS } from "../../utils/blood/bloodConstants";

import { districtsData } from "../../data/districtsData";

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
    <section className="card p-6 lg:p-8 mb-8">
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

      <form onSubmit={onSearch}>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Blood Group */}

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

          {/* District */}

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

          {/* Upazila */}

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

          {/* Compensation */}

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

        {/* Actions */}

        <div className="flex flex-wrap gap-3 mt-6">
          <button type="submit" className="btn-primary" disabled={loading}>
            <Search size={17} />

            {loading ? "Searching..." : "Find Donors"}
          </button>

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
