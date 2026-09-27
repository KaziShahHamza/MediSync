// client/src/components/blood/BloodRequestLocation.jsx

// Renders district, upazila, hospital, and custom hospital fields.
// Resolves available hospitals from the selected Bangladesh district.

import { Hospital, MapPin } from "lucide-react";

import { districtsData } from "../../../data/districtsData";
import hospitalsData from "../../../data/hospitalsData";

const OTHER_HOSPITAL = "__other__";

export default function BloodRequestLocation({
  requestForm,
  requestUpazilas,
  hospitalSelectValue,
  onRequestChange,
  onHospitalChange,
}) {
  const selectedHospitalList = hospitalsData[requestForm.district] || [];

  return (
    <>
      <div className="mb-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="icon-wrapper">
            <MapPin size={19} className="icon-primary" />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">Location</h3>

            <p className="mt-0.5 text-xs text-muted">
              Where is the blood needed?
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="request-district" className="mb-2 block">
              District *
            </label>

            <select
              id="request-district"
              name="district"
              value={requestForm.district}
              onChange={onRequestChange}
              className="input"
              required
            >
              <option value="">Select district</option>

              {districtsData.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="request-upazila" className="mb-2 block">
              Upazila *
            </label>

            <select
              id="request-upazila"
              name="upazila"
              value={requestForm.upazila}
              onChange={onRequestChange}
              disabled={!requestForm.district}
              className="input disabled:bg-slate-100 disabled:text-slate-400"
              required
            >
              <option value="">
                {requestForm.district
                  ? "Select upazila"
                  : "Select district first"}
              </option>

              {requestUpazilas.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="icon-wrapper">
            <Hospital size={19} className="icon-primary" />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">Hospital</h3>

            <p className="mt-0.5 text-xs text-muted">Where should donors go?</p>
          </div>
        </div>

        <div>
          <label htmlFor="hospital" className="mb-2 block">
            Hospital *
          </label>

          <select
            id="hospital"
            value={hospitalSelectValue}
            onChange={onHospitalChange}
            disabled={!requestForm.district}
            className="input disabled:bg-slate-100 disabled:text-slate-400"
            required
          >
            <option value="">
              {requestForm.district
                ? "Select hospital"
                : "Select district first"}
            </option>

            {selectedHospitalList.map((hospital) => (
              <option key={hospital.name} value={hospital.name}>
                {hospital.name}
              </option>
            ))}

            <option value={OTHER_HOSPITAL}>Other / Hospital not listed</option>
          </select>
        </div>

        {hospitalSelectValue === OTHER_HOSPITAL && (
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div>
              <label htmlFor="hospital-name" className="mb-2 block">
                Hospital Name *
              </label>

              <input
                id="hospital-name"
                name="hospitalName"
                type="text"
                value={requestForm.hospitalName}
                onChange={onRequestChange}
                className="input"
                placeholder="Enter hospital name"
                maxLength="200"
                required
              />
            </div>

            <div>
              <label htmlFor="hospital-address" className="mb-2 block">
                Hospital Address *
              </label>

              <input
                id="hospital-address"
                name="hospitalAddress"
                type="text"
                value={requestForm.hospitalAddress}
                onChange={onRequestChange}
                className="input"
                placeholder="Enter hospital address"
                maxLength="500"
                required
              />
            </div>
          </div>
        )}

        {hospitalSelectValue !== OTHER_HOSPITAL && requestForm.hospitalName && (
          <div className="surface-muted mt-4 p-4">
            <p className="text-sm font-semibold text-slate-800">
              {requestForm.hospitalName}
            </p>

            <p className="mt-1 text-xs text-muted">
              {requestForm.hospitalAddress}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
