// client/src/utils/doctor/doctorFormUtils.js

// Provides doctor-form defaults, hospital options, and shared form utilities.
// Keeps reusable form data creation outside React components.

import hospitalsData from "../../data/hospitalsData";

// Current year used for generating the last-visit options.
export const currentYear = new Date().getFullYear();

// Generates the current year and previous nine years.
export const lastVisitYears = Array.from(
  { length: 10 },
  (_, index) => currentYear - index,
);

// Converts hospital data into a flat list for select inputs.
export const chamberHospitals = Object.entries(hospitalsData).flatMap(
  ([district, hospitals]) =>
    hospitals.map((hospital, index) => ({
      ...hospital,
      district,
      key: `${district}-${index}-${hospital.name}`,
    })),
);

// Creates a stable select value for a hospital.
export function getChamberHospitalValue(hospital) {
  return `${hospital.name}|||${hospital.district}|||${hospital.address}`;
}

// Creates a fresh empty chamber object.
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

// Creates a fresh doctor form with empty default values.
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

// Legacy aliases kept for compatibility with existing imports.
// New code should use createEmptyChamber() and createEmptyForm()
// so nested form data is freshly created every time.

export const emptyChamber = createEmptyChamber();

export const emptyForm = createEmptyForm();
