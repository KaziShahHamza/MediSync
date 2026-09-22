// client/src/components/blood/BloodRequestForm.jsx

// Form component for creating or editing blood requests.
// Captures details such as blood group, required quantity, location, hospital information, and contact info.
// Displays contextual fields based on user selection and auth status.

import { Droplets, Hospital, MapPin, Phone, ShieldCheck } from "lucide-react";

import { BLOOD_GROUPS } from "../../utils/blood/bloodConstants";

import { districtsData } from "../../data/districtsData";
import hospitalsData from "../../data/hospitalsData";

// Render form to create or edit a blood request
export default function BloodRequestForm({
  user,
  requestForm,
  requestUpazilas,
  hospitalSelectValue,
  onRequestChange,
  onHospitalChange,
}) {
  // Retrieve available hospitals based on selected district
  const selectedHospitalList = hospitalsData[requestForm.district] || [];

  // Sentinel value representing custom hospital input
  const OTHER_HOSPITAL = "__other__";

  return (
    <>
      {/* Basic blood requirement section */}
      <div className="mb-8">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="icon-wrapper">
            <Droplets size={19} className="icon-primary" />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">Blood Requirement</h3>

            <p className="text-xs text-muted mt-0.5">What blood is needed?</p>
          </div>
        </div>

        {/* Blood details form controls */}
        <div className="grid md:grid-cols-2 gap-5">

          {/* Blood group selection dropdown */}
          <div>
            <label htmlFor="request-blood-group" className="block mb-2">
              Blood Group *
            </label>

            <select
              id="request-blood-group"
              name="bloodGroup"
              value={requestForm.bloodGroup}
              onChange={onRequestChange}
              className="input"
              required
            >
              <option value="">Select blood group</option>

              {/* Render options for blood groups */}
              {BLOOD_GROUPS.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>


          {/* Quantity of blood bags required */}
          <div>
            <label htmlFor="bags-needed" className="block mb-2">
              Number of Bags *
            </label>

            <input
              id="bags-needed"
              name="bagsNeeded"
              type="number"
              min="1"
              max="20"
              step="1"
              value={requestForm.bagsNeeded}
              onChange={onRequestChange}
              className="input"
              required
            />
          </div>
        </div>


        {/* Honorarium/travel expense offering selector */}
        <div className="mt-5">
          <label htmlFor="compensation-offered" className="block mb-2">
            Will you provide honorarium / travel cost? *
          </label>

          <select
            id="compensation-offered"
            name="compensationOffered"
            value={requestForm.compensationOffered}
            onChange={onRequestChange}
            className="input"
            required
          >
            <option value="">Select</option>

            <option value="yes">Yes</option>

            <option value="no">No</option>
          </select>
        </div>
      </div>

      {/* Location information section */}
      <div className="mb-8">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="icon-wrapper">
            <MapPin size={19} className="icon-primary" />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">Location</h3>

            <p className="text-xs text-muted mt-0.5">
              Where is the blood needed?
            </p>
          </div>
        </div>

        {/* Region controls */}
        <div className="grid md:grid-cols-2 gap-5">

          {/* District selection dropdown */}
          <div>
            <label htmlFor="request-district" className="block mb-2">
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

              {/* Render district options */}
              {districtsData.map((item) => (
                <option key={item.name} value={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Upazila select based on chosen district */}
          <div>
            <label htmlFor="request-upazila" className="block mb-2">
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

              {/* Render upazila options */}
              {requestUpazilas.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Target hospital details section */}
      <div className="mb-8">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="icon-wrapper">
            <Hospital size={19} className="icon-primary" />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">Hospital</h3>

            <p className="text-xs text-muted mt-0.5">Where should donors go?</p>
          </div>
        </div>

        {/* Primary hospital dropdown */}
        <div>
          <label htmlFor="hospital" className="block mb-2">
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

            {/* Render district-specific hospital options */}
            {selectedHospitalList.map((hospital) => (
              <option key={hospital.name} value={hospital.name}>
                {hospital.name}
              </option>
            ))}

            <option value={OTHER_HOSPITAL}>Other / Hospital not listed</option>
          </select>
        </div>


        {/* Custom hospital input fields for unlisted items */}
        {hospitalSelectValue === OTHER_HOSPITAL && (
          <div className="grid md:grid-cols-2 gap-5 mt-5">
            {/* Custom hospital name field */}
            <div>
              <label htmlFor="hospital-name" className="block mb-2">
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

            {/* Custom hospital address field */}
            <div>
              <label htmlFor="hospital-address" className="block mb-2">
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


        {/* Read-only preview card for selected existing hospital */}
        {hospitalSelectValue !== OTHER_HOSPITAL && requestForm.hospitalName && (
          <div className="surface-muted p-4 mt-4">
            <p className="text-sm font-semibold text-slate-800">
              {requestForm.hospitalName}
            </p>

            <p className="text-xs text-muted mt-1">
              {requestForm.hospitalAddress}
            </p>
          </div>
        )}
      </div>

      {/* Requester contact information section */}
      <div className="mb-8">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="icon-wrapper">
            <Phone size={19} className="icon-primary" />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              Contact Information
            </h3>

            <p className="text-xs text-muted mt-0.5">
              Donors will use this number to contact you.
            </p>
          </div>
        </div>

        {/* Contact input fields */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* Phone number input field */}
          <div>
            <label htmlFor="contact-phone" className="block mb-2">
              Contact Phone *
            </label>

            <input
              id="contact-phone"
              name="contactPhone"
              type="tel"
              value={requestForm.contactPhone}
              onChange={onRequestChange}
              className="input"
              placeholder="01XXXXXXXXX"
              maxLength="30"
              required
            />
          </div>

          {/* Requester name input field */}
          <div>
            <label htmlFor="requester-name" className="block mb-2">
              Requester Name
            </label>

            <input
              id="requester-name"
              name="requesterName"
              type="text"
              value={requestForm.requesterName}
              onChange={onRequestChange}
              className="input"
              placeholder="Optional"
              maxLength="100"
            />
          </div>
        </div>
      </div>

      {/* Optional additional notes textarea */}
      <div>
        <label htmlFor="request-notes" className="block mb-2">
          Additional Information
        </label>

        <textarea
          id="request-notes"
          name="notes"
          value={requestForm.notes}
          onChange={onRequestChange}
          className="input min-h-28"
          placeholder="Any additional information donors should know..."
          maxLength="1000"
        />
      </div>

      {/* Guest user informational notice regarding post management */}
      {!user && (
        <div className="surface-muted p-4 mt-6">
          <div className="flex items-start gap-3">
            <span className="text-blue-600 shrink-0 mt-0.5">
              <ShieldCheckIcon />
            </span>

            <div>
              <p className="text-sm font-medium text-slate-800">
                No account required
              </p>

              <p className="text-xs text-muted mt-1">
                You can post this request without signing up. After posting, we
                will give you a private management code so you can edit or
                delete your request.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Inline SVG icon component for safety checkmark
function ShieldCheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="19"
      height="19"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-8 8.5-4.5-1-8-3.5-8-8.5V5l8-3 8 3v8Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
