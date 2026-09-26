// client/src/utils/doctor/doctorFunctions.js

// Provides doctor form transformations, chamber actions, and normalization.
// Keeps reusable doctor data operations separate from hooks and components.

import {
  chamberHospitals,
  createEmptyChamber,
  createEmptyForm,
  getChamberHospitalValue,
} from "./doctorFormUtils";

// Find the predefined hospital matching a chamber.
export function getSelectedChamberHospital(chamber) {
  if (!chamber?.name || !chamber?.district) {
    return null;
  }

  return (
    chamberHospitals.find(
      (hospital) =>
        hospital.name === chamber.name &&
        hospital.district === chamber.district &&
        hospital.address === chamber.address,
    ) || null
  );
}

// Update one field in a specific chamber.
export function updateChamber(form, index, field, value) {
  return {
    ...form,
    chambers: form.chambers.map((chamber, chamberIndex) =>
      chamberIndex === index
        ? {
            ...chamber,
            [field]: value,
          }
        : chamber,
    ),
  };
}

// Update one visiting-time field in a specific chamber.
export function updateVisitingTime(form, index, field, value) {
  return {
    ...form,
    chambers: form.chambers.map((chamber, chamberIndex) =>
      chamberIndex === index
        ? {
            ...chamber,
            visitingTime: {
              ...chamber.visitingTime,
              [field]: value,
            },
          }
        : chamber,
    ),
  };
}

// Select a predefined hospital and populate its chamber fields.
export function selectChamberHospital(form, index, value) {
  const selectedHospital = chamberHospitals.find(
    (hospital) => getChamberHospitalValue(hospital) === value,
  );

  // Clear hospital fields when no predefined hospital is selected.
  if (!selectedHospital) {
    return {
      ...form,
      chambers: form.chambers.map((chamber, chamberIndex) =>
        chamberIndex === index
          ? {
              ...chamber,
              name: "",
              district: "",
              address: "",
            }
          : chamber,
      ),
    };
  }

  return {
    ...form,
    chambers: form.chambers.map((chamber, chamberIndex) =>
      chamberIndex === index
        ? {
            ...chamber,
            name: selectedHospital.name,
            district: selectedHospital.district,
            address: selectedHospital.address,
          }
        : chamber,
    ),
  };
}

// Add a fresh empty chamber to the doctor form.
export function addChamber(form) {
  return {
    ...form,
    chambers: [...form.chambers, createEmptyChamber()],
  };
}

// Remove a chamber while retaining at least one chamber.
export function removeChamber(form, index) {
  if (form.chambers.length <= 1) {
    return form;
  }

  return {
    ...form,
    chambers: form.chambers.filter((_, chamberIndex) => chamberIndex !== index),
  };
}

// Convert an existing doctor into the controlled form structure.
export function createFormFromDoctor(doctor) {
  return {
    name: doctor.name || "",
    bmdcRegNo: doctor.bmdcRegNo || "",
    degrees: Array.isArray(doctor.degrees) ? doctor.degrees : [],
    specialities: Array.isArray(doctor.specialities) ? doctor.specialities : [],
    designation: doctor.designation || "",
    primaryHospital: doctor.primaryHospital || "",
    lastVisit:
      doctor.lastVisit !== null && doctor.lastVisit !== undefined
        ? String(doctor.lastVisit)
        : "",

    chambers:
      Array.isArray(doctor.chambers) && doctor.chambers.length > 0
        ? doctor.chambers.map((chamber) => ({
            name: chamber.name || "",
            district: chamber.district || "",
            address: chamber.address || "",
            phone: chamber.phone || "",
            serialNumber: chamber.serialNumber || "",
            visitFee:
              chamber.visitFee !== null && chamber.visitFee !== undefined
                ? String(chamber.visitFee)
                : "",
            visitingDays: Array.isArray(chamber.visitingDays)
              ? chamber.visitingDays
              : [],
            visitingTime: {
              startHour: chamber.visitingTime?.startHour || "6",
              startPeriod: chamber.visitingTime?.startPeriod || "PM",
              endHour: chamber.visitingTime?.endHour || "9",
              endPeriod: chamber.visitingTime?.endPeriod || "PM",
            },
          }))
        : [createEmptyChamber()],

    contactInfo: {
      phones: Array.isArray(doctor.contactInfo?.phones)
        ? doctor.contactInfo.phones
        : [],
      emails: Array.isArray(doctor.contactInfo?.emails)
        ? doctor.contactInfo.emails
        : [],
      website: doctor.contactInfo?.website || "",
      facebook: doctor.contactInfo?.facebook || "",
      linkedin: doctor.contactInfo?.linkedin || "",
    },

    notes: doctor.notes || "",
  };
}

// Convert UI form values into API-ready doctor data.
export function cleanDoctorForm(form) {
  const degrees = Array.isArray(form.degrees) ? form.degrees : [];
  const specialities = Array.isArray(form.specialities)
    ? form.specialities
    : [];

  const chambers = Array.isArray(form.chambers) ? form.chambers : [];

  const phones = Array.isArray(form.contactInfo?.phones)
    ? form.contactInfo.phones
    : [];

  const emails = Array.isArray(form.contactInfo?.emails)
    ? form.contactInfo.emails
    : [];

  return {
    ...form,

    lastVisit: form.lastVisit ? Number(form.lastVisit) : null,

    degrees: degrees.filter(
      (degree) => typeof degree === "string" && degree.trim() !== "",
    ),

    specialities: specialities.filter(
      (speciality) =>
        typeof speciality === "string" && speciality.trim() !== "",
    ),

    chambers: chambers.map((chamber) => ({
      ...chamber,

      district:
        typeof chamber.district === "string" ? chamber.district.trim() : "",

      visitFee:
        chamber.visitFee !== "" &&
        chamber.visitFee !== null &&
        chamber.visitFee !== undefined
          ? Number(chamber.visitFee)
          : null,

      visitingDays: Array.isArray(chamber.visitingDays)
        ? chamber.visitingDays
        : [],
    })),

    contactInfo: {
      ...form.contactInfo,

      phones: phones.filter(
        (phone) => typeof phone === "string" && phone.trim() !== "",
      ),

      emails: emails.filter(
        (email) => typeof email === "string" && email.trim() !== "",
      ),
    },
  };
}

// Format a chamber visit fee using Bangladesh locale formatting.
export function formatVisitFee(value) {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  return Number(value).toLocaleString("en-BD");
}

// Create a completely fresh doctor form.
export function resetDoctorForm() {
  return createEmptyForm();
}
