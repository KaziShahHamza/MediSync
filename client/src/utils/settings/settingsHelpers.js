// client/src/utils/settings/settingsHelpers.js

// Provides reusable settings form helpers and immediate client-side validation.

export function getDonationMonthYear(value) {
  if (!value) return { month: "", year: "" };

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return { month: "", year: "" };
  }

  return {
    month: String(date.getUTCMonth() + 1),
    year: String(date.getUTCFullYear()),
  };
}

export function buildDonationDate(month, year) {
  if (!month || !year) return null;

  return new Date(Date.UTC(Number(year), Number(month) - 1, 1)).toISOString();
}

export function getInitials(name) {
  if (!name?.trim()) return "?";

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function validateSettingsForm(form) {
  const name = form?.name?.trim() || "";

  if (!name) {
    return "Please enter your name.";
  }

  if (name.length > 50) {
    return "Name cannot exceed 50 characters.";
  }

  // Validate DOB.
  if (form?.dob) {
    const dob = new Date(`${form.dob}T00:00:00`);

    if (Number.isNaN(dob.getTime())) {
      return "Please enter a valid date of birth.";
    }

    if (dob > new Date()) {
      return "Date of birth cannot be in the future.";
    }
  }

  // Validate height.
  const feet = form?.height?.feet;
  const inches = form?.height?.inches;

  const hasFeet = feet !== "" && feet !== null && feet !== undefined;
  const hasInches = inches !== "" && inches !== null && inches !== undefined;

  if (hasFeet !== hasInches) {
    return "Please provide both feet and inches.";
  }

  if (hasFeet && hasInches) {
    const feetNumber = Number(feet);
    const inchesNumber = Number(inches);

    if (!Number.isInteger(feetNumber) || feetNumber < 1 || feetNumber > 9) {
      return "Height in feet must be between 1 and 9.";
    }

    if (
      !Number.isInteger(inchesNumber) ||
      inchesNumber < 0 ||
      inchesNumber > 11
    ) {
      return "Height in inches must be between 0 and 11.";
    }
  }

  const emergencyContacts = Array.isArray(form?.emergencyContacts)
    ? form.emergencyContacts
    : [];

  if (emergencyContacts.length > 3) {
    return "You can add a maximum of 3 emergency contacts.";
  }

  for (const contact of emergencyContacts) {
    const relation = contact?.relation?.trim() || "";
    const name = contact?.name?.trim() || "";
    const phone = contact?.phone?.trim() || "";
    const email = contact?.email?.trim() || "";

    if (!relation) {
      return "Please select a relation for every emergency contact.";
    }

    if (!name) {
      return "Please enter the name of every emergency contact.";
    }

    if (name.length > 50) {
      return "Emergency contact names cannot exceed 50 characters.";
    }

    if (!phone && !email) {
      return "Each emergency contact must have a phone number or email address.";
    }

    if (phone && phone.length > 30) {
      return "Emergency contact phone number is too long.";
    }

    if (email && email.length > 254) {
      return "Emergency contact email is too long.";
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return `Please enter a valid email for ${name}.`;
    }
  }

  // Validate donation date selection.
  const month = form?.lastBloodDonation?.month || "";
  const year = form?.lastBloodDonation?.year || "";

  if ((month && !year) || (!month && year)) {
    return "Please select both the month and year of the last blood donation.";
  }

  if (month && year) {
    const selectedDate = new Date(Number(year), Number(month) - 1, 1);

    const now = new Date();

    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    if (selectedDate > currentMonth) {
      return "Last blood donation cannot be in the future.";
    }
  }

  // Donor-specific validation.
  const isDonor =
    form?.bloodDonorStatus === "yes" || form?.bloodDonorStatus === "willingly";

  if (isDonor) {
    if (!form?.bloodDonationContactNumber?.trim()) {
      return "A contact number is required when you are available to donate blood.";
    }

    if (!form?.location?.district) {
      return "Please select your district.";
    }

    if (!form?.location?.upazila) {
      return "Please select your upazila.";
    }
  }

  return null;
}
