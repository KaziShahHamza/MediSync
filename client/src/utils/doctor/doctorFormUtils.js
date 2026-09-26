// client/src/utils/doctor/doctorFormUtils.js

// Provides doctor form defaults, hospital options, and reusable form data.
// Keeps doctor-specific static data and form factories outside components.

import hospitalsData from "../../data/hospitalsData";

// Generate selectable years for the doctor's last visit.
export const currentYear = new Date().getFullYear();

export const lastVisitYears = Array.from(
  { length: 10 },
  (_, index) => currentYear - index,
);

// Flatten hospital data into reusable chamber select options.
export const chamberHospitals = Object.entries(hospitalsData).flatMap(
  ([district, hospitals]) =>
    hospitals.map((hospital, index) => ({
      ...hospital,
      district,
      key: `${district}-${index}-${hospital.name}`,
    })),
);

// Create a stable select value for a hospital.
export function getChamberHospitalValue(hospital) {
  return `${hospital.name}|||${hospital.district}|||${hospital.address}`;
}

// Create a fresh empty chamber object.
export function createEmptyChamber() {
  return {
    name: "",
    district: "",
    address: "",
    phone: "",
    serialNumber: "",
    visitFee: "",
    visitingDays: [],
    visitingTime: {
      startHour: "6",
      startPeriod: "PM",
      endHour: "9",
      endPeriod: "PM",
    },
  };
}

// Create a fresh empty doctor form.
export function createEmptyForm() {
  return {
    name: "",
    bmdcRegNo: "",
    degrees: [],
    specialities: [],
    designation: "",
    primaryHospital: "",
    lastVisit: "",
    chambers: [createEmptyChamber()],
    contactInfo: {
      phones: [],
      emails: [],
      website: "",
      facebook: "",
      linkedin: "",
    },
    notes: "",
  };
}

// Preserve legacy exports for existing imports.
export const emptyChamber = createEmptyChamber();
export const emptyForm = createEmptyForm();
