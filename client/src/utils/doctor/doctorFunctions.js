// client/src/utils/doctor/doctorFunctions.js

// Contains reusable doctor-form transformations and chamber helpers.
// Keeps form logic separate from React components and hooks.

import {
  chamberHospitals,
  createEmptyChamber,
  createEmptyForm,
  getChamberHospitalValue,
} from "./doctorFormUtils";

// Finds the predefined hospital matching an existing chamber.
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

// Updates one field of a specific chamber.
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

// Updates one visiting-time field of a specific chamber.
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

// Selects a predefined hospital and fills its chamber details.
export function selectChamberHospital(form, index, value) {
  const selectedHospital = chamberHospitals.find(
    (hospital) => getChamberHospitalValue(hospital) === value,
  );

  // Clear hospital fields when the selection is invalid or empty.
  if (!selectedHospital) {
    return updateChamber(
      updateChamber(form, index, "name", ""),
      index,
      "district",
      "",
    );
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

// Adds a fresh empty chamber to the form.
export function addChamber(form) {
  return {
    ...form,
    chambers: [...form.chambers, createEmptyChamber()],
  };
}

// Removes a chamber while keeping at least one chamber.
export function removeChamber(form, index) {
  if (form.chambers.length <= 1) {
    return form;
  }

  return {
    ...form,
    chambers: form.chambers.filter((_, chamberIndex) => chamberIndex !== index),
  };
}

// Converts an existing doctor into the form's editable structure.
export function createFormFromDoctor(doctor) {
  return {
    name: doctor.name || "",
    bmdcRegNo: doctor.bmdcRegNo || "",
    degrees: doctor.degrees || [],
    specialities: doctor.specialities || [],
    designation: doctor.designation || "",
    primaryHospital: doctor.primaryHospital || "",
    lastVisit:
      doctor.lastVisit !== null && doctor.lastVisit !== undefined
        ? String(doctor.lastVisit)
        : "",

    // Normalize existing chambers for form editing.
    chambers:
      doctor.chambers?.length > 0
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
            visitingDays: chamber.visitingDays || [],
            visitingTime: {
              startHour: chamber.visitingTime?.startHour || "6",
              startPeriod: chamber.visitingTime?.startPeriod || "PM",
              endHour: chamber.visitingTime?.endHour || "9",
              endPeriod: chamber.visitingTime?.endPeriod || "PM",
            },
          }))
        : [createEmptyChamber()],

    // Normalize contact information for controlled inputs.
    contactInfo: {
      phones: doctor.contactInfo?.phones || [],
      emails: doctor.contactInfo?.emails || [],
      website: doctor.contactInfo?.website || "",
      facebook: doctor.contactInfo?.facebook || "",
      linkedin: doctor.contactInfo?.linkedin || "",
    },

    notes: doctor.notes || "",
  };
}

// Converts UI-friendly form values into API-ready data.
export function cleanDoctorForm(form) {
  return {
    ...form,

    // Convert the selected year back into a number.
    lastVisit: form.lastVisit ? Number(form.lastVisit) : null,

    // Remove empty degree values before saving.
    degrees: form.degrees.filter((degree) => degree.trim() !== ""),

    // Remove empty speciality values before saving.
    specialities: form.specialities.filter(
      (speciality) => speciality.trim() !== "",
    ),

    // Normalize chamber values before the API request.
    chambers: form.chambers.map((chamber) => ({
      ...chamber,

      district: chamber.district?.trim() || "",

      visitFee:
        chamber.visitFee !== "" &&
        chamber.visitFee !== null &&
        chamber.visitFee !== undefined
          ? Number(chamber.visitFee)
          : null,

      visitingDays: chamber.visitingDays || [],
    })),

    // Remove empty contact entries before saving.
    contactInfo: {
      ...form.contactInfo,

      phones: form.contactInfo.phones.filter((phone) => phone.trim() !== ""),

      emails: form.contactInfo.emails.filter((email) => email.trim() !== ""),
    },
  };
}

// Formats a chamber visit fee for Bangladesh currency display.
export function formatVisitFee(value) {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  return Number(value).toLocaleString("en-BD");
}

// Creates a completely fresh doctor form.
export function resetDoctorForm() {
  return createEmptyForm();
}
