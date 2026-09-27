// client/src/components/blood/BloodRequestDetails.jsx

// Renders blood requirement, requester contact, and additional information fields.
// Keeps request-specific input sections separate from location and hospital logic.

import { Droplets, Phone, ShieldCheck } from "lucide-react";

import { BLOOD_GROUPS } from "../../../utils/blood/bloodRequestHelpers";

export default function BloodRequestDetails({
  user,
  requestForm,
  onRequestChange,
}) {
  return (
    <>
      <div className="mb-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="icon-wrapper">
            <Droplets size={19} className="icon-primary" />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">Blood Requirement</h3>

            <p className="mt-0.5 text-xs text-muted">What blood is needed?</p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="request-blood-group" className="mb-2 block">
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

              {BLOOD_GROUPS.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="bags-needed" className="mb-2 block">
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

        <div className="mt-5">
          <label htmlFor="compensation-offered" className="mb-2 block">
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

      <div className="mb-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="icon-wrapper">
            <Phone size={19} className="icon-primary" />
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">
              Contact Information
            </h3>

            <p className="mt-0.5 text-xs text-muted">
              Donors will use this number to contact you.
            </p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label htmlFor="contact-phone" className="mb-2 block">
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

          <div>
            <label htmlFor="requester-name" className="mb-2 block">
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

      <div>
        <label htmlFor="request-notes" className="mb-2 block">
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

      {!user && <GuestNotice />}
    </>
  );
}

function GuestNotice() {
  return (
    <div className="surface-muted mt-6 p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0 text-blue-600">
          <ShieldCheck size={19} />
        </span>

        <div>
          <p className="text-sm font-medium text-slate-800">
            No account required
          </p>

          <p className="mt-1 text-xs text-muted">
            You can post this request without signing up. After posting, we will
            give you a private management code so you can edit or delete your
            request.
          </p>
        </div>
      </div>
    </div>
  );
}
