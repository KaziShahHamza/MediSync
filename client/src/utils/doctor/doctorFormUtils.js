import hospitalsData from "../../data/hospitalsData";

export const currentYear = new Date().getFullYear();

export const lastVisitYears = Array.from(
  { length: 10 },
  (_, index) => currentYear - index,
);

export const chamberHospitals = Object.entries(hospitalsData).flatMap(
  ([district, hospitals]) =>
    hospitals.map((hospital, index) => ({
      ...hospital,
      district,
      key: `${district}-${index}-${hospital.name}`,
    })),
);

export function getChamberHospitalValue(hospital) {
  return `${hospital.name}|||${hospital.district}|||${hospital.address}`;
}

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

/*
 * Kept for compatibility with any existing code that may still import
 * emptyChamber or emptyForm directly.
 *
 * New code should prefer createEmptyChamber() and createEmptyForm()
 * so every form gets fresh nested objects.
 */
export const emptyChamber = createEmptyChamber();
export const emptyForm = createEmptyForm();