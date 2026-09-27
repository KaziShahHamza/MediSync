// client/src/components/blood/BloodRequestForm.jsx

// Composes the blood request form sections and coordinates shared form data.

import BloodRequestDetails from "./BloodRequestDetails";
import BloodRequestLocation from "./BloodRequestLocation";

export default function BloodRequestForm({
  user,
  requestForm,
  requestUpazilas,
  hospitalSelectValue,
  onRequestChange,
  onHospitalChange,
}) {
  return (
    <>
      <BloodRequestDetails
        user={user}
        requestForm={requestForm}
        onRequestChange={onRequestChange}
      />

      <BloodRequestLocation
        requestForm={requestForm}
        requestUpazilas={requestUpazilas}
        hospitalSelectValue={hospitalSelectValue}
        onRequestChange={onRequestChange}
        onHospitalChange={onHospitalChange}
      />
    </>
  );
}
