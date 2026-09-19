import {
  chamberHospitals,
  createEmptyChamber,
  createEmptyForm,
  getChamberHospitalValue,
} from "./doctorFormUtils";

/**
 * Returns the hospital option matching an existing chamber.
 */
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

/**
 * Updates one field inside a chamber.
 */
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

/**
 * Updates visiting time for a chamber.
 */
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

/**
 * Selects a chamber hospital from the predefined hospital list.
 */
export function selectChamberHospital(form, index, value) {
  const selectedHospital = chamberHospitals.find(
    (hospital) => getChamberHospitalValue(hospital) === value,
  );

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

/**
 * Adds a new empty chamber.
 */
export function addChamber(form) {
  return {
    ...form,
    chambers: [...form.chambers, createEmptyChamber()],
  };
}

/**
 * Removes a chamber.
 *
 * The existing behavior keeps at least one chamber in the form.
 */
export function removeChamber(form, index) {
  if (form.chambers.length <= 1) {
    return form;
  }

  return {
    ...form,
    chambers: form.chambers.filter(
      (_, chamberIndex) => chamberIndex !== index,
    ),
  };
}

/**
 * Converts an existing doctor object into the structure
 * expected by the doctor form.
 */
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
    chambers:
      doctor.chambers?.length > 0
        ? doctor.chambers.map((chamber) => ({
            name: chamber.name || "",
            district: chamber.district || "",
            address: chamber.address || "",
            phone: chamber.phone || "",
            serialNumber: chamber.serialNumber || "",
            visitFee:
              chamber.visitFee !== null &&
              chamber.visitFee !== undefined
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

/**
 * Creates the payload that should be sent to the backend.
 *
 * Form values are kept UI-friendly while editing, then normalized
 * here immediately before the API request.
 */
export function cleanDoctorForm(form) {
  return {
    ...form,

    lastVisit: form.lastVisit ? Number(form.lastVisit) : null,

    degrees: form.degrees.filter(
      (degree) => degree.trim() !== "",
    ),

    specialities: form.specialities.filter(
      (speciality) => speciality.trim() !== "",
    ),

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

    contactInfo: {
      ...form.contactInfo,

      phones: form.contactInfo.phones.filter(
        (phone) => phone.trim() !== "",
      ),

      emails: form.contactInfo.emails.filter(
        (email) => email.trim() !== "",
      ),
    },
  };
}

/**
 * Formats a visit fee for display.
 */
export function formatVisitFee(value) {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  return Number(value).toLocaleString("en-BD");
}

/**
 * Creates a completely fresh doctor form.
 */
export function resetDoctorForm() {
  return createEmptyForm();
}