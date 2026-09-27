// client/src/utils/settings/settingsHelpers.js

// Provides reusable settings validation, date conversion, and display helpers.
// Keeps generic settings utilities independent from form-state management.

// Converts a stored donation date into month and year form values.
export function getDonationMonthYear(value) {
  if (!value) {
    return {
      month: "",
      year: "",
    };
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return {
      month: "",
      year: "",
    };
  }

  return {
    month: String(date.getUTCMonth() + 1),
    year: String(date.getUTCFullYear()),
  };
}

// Converts selected donation month and year into an ISO date.
export function buildDonationDate(month, year) {
  if (!month || !year) {
    return null;
  }

  return new Date(Date.UTC(Number(year), Number(month) - 1, 1)).toISOString();
}

// Generates uppercase initials from a user's display name.
export function getInitials(name) {
  if (!name?.trim()) {
    return "?";
  }

  const parts = name.trim().split(/\s+/);

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Validates emergency contacts and blood donation form fields.
export function validateSettingsForm(form) {
  const emergencyContacts = Array.isArray(form?.emergencyContacts)
    ? form.emergencyContacts
    : [];

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

    if (!phone && !email) {
      return "Each emergency contact must have a phone number or email address.";
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return `Please enter a valid email for ${name}.`;
    }
  }

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

  return null;
}
