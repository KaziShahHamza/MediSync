// client/src/pages/BloodNeed.jsx

import { useEffect, useMemo, useState } from "react";
import {
  Droplets,
  MapPin,
  Phone,
  Search,
  RotateCcw,
} from "lucide-react";

import { districtsData } from "../data/districtsData";

const API_URL = import.meta.env.VITE_API_URL;

const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
];

export default function BloodNeed() {
  const [bloodGroup, setBloodGroup] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [compensation, setCompensation] = useState("");

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const selectedDistrict = useMemo(
    () => districtsData.find((item) => item.name === district),
    [district],
  );

  const upazilas = selectedDistrict?.upazilas || [];

  useEffect(() => {
    setUpazila("");
  }, [district]);

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
      setError(
        err.message || "Unable to search for blood donors.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    fetchDonors();
  };

  const handleReset = () => {
    setBloodGroup("");
    setDistrict("");
    setUpazila("");
    setCompensation("");
    setDonors([]);
    setError("");
    setSearched(false);
  };

  return (
    <main className="container py-10 lg:py-14">
      {/* Page Header */}
      <div className="page-header">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-sky-50 text-sky-600 mb-4">
          <Droplets size={25} strokeWidth={2} />
        </div>

        <h1 className="page-title">Blood Need</h1>

        <p className="page-description max-w-2xl">
          Find people who are available or willing to donate
          blood in your area.
        </p>
      </div>

      {/* Search Card */}
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

        <form onSubmit={handleSearch}>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Blood Group */}
            <div>
              <label
                htmlFor="blood-group"
                className="small-label block mb-2"
              >
                Blood Group
              </label>

              <select
                id="blood-group"
                value={bloodGroup}
                onChange={(event) =>
                  setBloodGroup(event.target.value)
                }
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
              <label
                htmlFor="district"
                className="small-label block mb-2"
              >
                District
              </label>

              <select
                id="district"
                value={district}
                onChange={(event) =>
                  setDistrict(event.target.value)
                }
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
              <label
                htmlFor="upazila"
                className="small-label block mb-2"
              >
                Upazila
              </label>

              <select
                id="upazila"
                value={upazila}
                onChange={(event) =>
                  setUpazila(event.target.value)
                }
                disabled={!district}
                className="input disabled:bg-slate-100 disabled:text-slate-400"
              >
                <option value="">
                  {district
                    ? "All upazilas"
                    : "Select district first"}
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
              <label
                htmlFor="compensation"
                className="small-label block mb-2"
              >
                Will you Provide travel cost? (সম্মানী)
              </label>

              <select
                id="compensation"
                value={compensation}
                onChange={(event) =>
                  setCompensation(event.target.value)
                }
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
            <button
              type="submit"
              className="btn-primary inline-flex items-center gap-2"
              disabled={loading}
            >
              <Search size={17} />

              {loading ? "Searching..." : "Find Donors"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="btn-secondary inline-flex items-center gap-2"
              disabled={loading}
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </form>
      </section>

      {/* Error */}
      {error && (
        <div className="card p-5 mb-8 border border-red-200 bg-red-50">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Results */}
      {searched && !loading && !error && (
        <section>
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="section-title text-xl">
                Available Donors
              </h2>

              <p className="text-sm text-muted mt-1">
                {donors.length} donor
                {donors.length !== 1 ? "s" : ""} found.
              </p>
            </div>
          </div>

          {donors.length > 0 ? (
            <div className="card overflow-hidden">
              {/* Desktop Header */}
              <div className="hidden md:grid md:grid-cols-[1.2fr_1.5fr_1.5fr_1.2fr] gap-4 px-6 py-4 bg-slate-50 border-b border-slate-200">
                <p className="small-label">Blood Group</p>
                <p className="small-label">District</p>
                <p className="small-label">Upazila</p>
                <p className="small-label text-right">Contact</p>
              </div>

              {/* Donor Rows */}
              <div className="divide-y divide-slate-200">
                {donors.map((donor, index) => (
                  <div
                    key={`${donor.bloodGroup}-${donor.district}-${donor.upazila}-${index}`}
                    className="px-5 py-5 md:px-6"
                  >
                    {/* Desktop */}
                    <div className="hidden md:grid md:grid-cols-[1.2fr_1.5fr_1.5fr_1.2fr] gap-4 items-center">
                      {/* Blood Group */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                          <Droplets size={19} />
                        </div>

                        <span className="text-lg font-bold text-slate-900">
                          {donor.bloodGroup || "-"}
                        </span>
                      </div>

                      {/* District */}
                      <div className="flex items-center gap-2">
                        <MapPin
                          size={17}
                          className="text-slate-400 shrink-0"
                        />

                        <span className="text-sm font-medium text-slate-800">
                          {donor.district || "-"}
                        </span>
                      </div>

                      {/* Upazila */}
                      <div className="flex items-center gap-2">
                        <MapPin
                          size={17}
                          className="text-slate-400 shrink-0"
                        />

                        <span className="text-sm font-medium text-slate-800">
                          {donor.upazila || "-"}
                        </span>
                      </div>

                      {/* Contact */}
                      <div className="flex justify-end">
                        <a
                          href={`tel:${donor.bloodDonationContactNumber}`}
                          className="btn-primary inline-flex items-center justify-center gap-2"
                        >
                          <Phone size={16} />
                          Contact
                        </a>
                      </div>
                    </div>

                    {/* Mobile */}
                    <div className="md:hidden">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                            <Droplets size={20} />
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">
                              Blood Group
                            </p>

                            <p className="text-xl font-bold text-slate-900">
                              {donor.bloodGroup || "-"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-slate-500">
                            District
                          </p>

                          <p className="text-sm font-medium text-slate-800 mt-1">
                            {donor.district || "-"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-500">
                            Upazila
                          </p>

                          <p className="text-sm font-medium text-slate-800 mt-1">
                            {donor.upazila || "-"}
                          </p>
                        </div>
                      </div>

                      <a
                        href={`tel:${donor.bloodDonationContactNumber}`}
                        className="btn-primary w-full inline-flex items-center justify-center gap-2 mt-5"
                      >
                        <Phone size={17} />
                        Contact Donor
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card p-8 text-center">
              <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mb-4">
                <Droplets size={22} />
              </div>

              <h3 className="text-lg font-semibold text-slate-800">
                No donors found
              </h3>

              <p className="text-sm text-muted mt-2 max-w-md mx-auto">
                No available donors match your selected blood
                group, location, and compensation preference.
                Try changing the filters.
              </p>
            </div>
          )}
        </section>
      )}

      {/* Initial State */}
      {!searched && !loading && !error && (
        <section className="card p-8 text-center">
          <div className="w-12 h-12 mx-auto rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
            <Droplets size={22} />
          </div>

          <h2 className="text-lg font-semibold text-slate-800">
            Search for a blood donor
          </h2>

          <p className="text-sm text-muted mt-2 max-w-md mx-auto">
            Select the blood group and location you need, then
            search for donors who are available to help.
          </p>
        </section>
      )}
    </main>
  );
}

