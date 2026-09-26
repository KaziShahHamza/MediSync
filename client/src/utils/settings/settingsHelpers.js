// client/src/utils/settings/settingsHelpers.js

// Provides reusable settings form state, formatting, validation, and payload helpers.
// Handles profile normalization and Bangladesh-specific emergency contact actions.

// Creates the default structure for an emergency contact.
export const createEmptyContact = () => ({
  relation: "",
  name: "",
  phone: "",
  email: "",
});

// Defines the default settings form state.
export const initialForm = {
  name: "",
  dob: "",
  gender: "",

  height: {
    feet: "",
    inches: "",
  },

  bloodGroup: "",

  location: {
    district: "",
    upazila: "",
    streetAddress: "",
  },

  allergies: "",
  chronicIllnesses: [],
  surgeries: "",

  emergencyContacts: [],

  bloodDonorStatus: "",
  bloodDonationCompensation: "",

  lastBloodDonation: {
    month: "",
    year: "",
  },

  bloodDonationContactNumber: "",
};

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

  // Validate each configured emergency contact.
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

  // Require both month and year when a donation date is provided.
  if ((month && !year) || (!month && year)) {
    return "Please select both the month and year of the last blood donation.";
  }

  // Prevent the recorded donation date from being in the future.
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

// Maps profile and user information into the settings form structure.
export function createFormFromProfile(profile, userInfo) {
  return {
    name: userInfo?.name || "",

    dob: profile?.dob ? new Date(profile.dob).toISOString().split("T")[0] : "",

    gender: profile?.gender || "",

    height: {
      feet: profile?.height?.feet ?? "",
      inches: profile?.height?.inches ?? "",
    },

    bloodGroup: profile?.bloodGroup || "",

    location: {
      district: profile?.location?.district || "",
      upazila: profile?.location?.upazila || "",
      streetAddress: profile?.location?.streetAddress || "",
    },

    allergies: profile?.allergies || "",

    chronicIllnesses: Array.isArray(profile?.chronicIllnesses)
      ? profile.chronicIllnesses
      : [],

    surgeries: profile?.surgeries || "",

    emergencyContacts: Array.isArray(profile?.emergencyContacts)
      ? profile.emergencyContacts.map((contact) => ({
          relation: contact?.relation || "",
          name: contact?.name || "",
          phone: contact?.phone || "",
          email: contact?.email || "",
        }))
      : [],

    bloodDonorStatus: profile?.bloodDonorStatus || "",

    bloodDonationCompensation: profile?.bloodDonationCompensation || "",

    lastBloodDonation: getDonationMonthYear(profile?.lastBloodDonation),

    bloodDonationContactNumber: profile?.bloodDonationContactNumber || "",
  };
}

// Transforms settings form state into the profile API payload.
export function buildProfilePayload(form) {
  const emergencyContacts = Array.isArray(form?.emergencyContacts)
    ? form.emergencyContacts
    : [];

  const chronicIllnesses = Array.isArray(form?.chronicIllnesses)
    ? form.chronicIllnesses
    : [];

  return {
    name: form.name,

    dob: form.dob || null,

    gender: form.gender,

    height: {
      feet: form.height.feet === "" ? null : Number(form.height.feet),
      inches: form.height.inches === "" ? null : Number(form.height.inches),
    },

    bloodGroup: form.bloodGroup,

    allergies: form.allergies,

    chronicIllnesses,

    surgeries: form.surgeries,

    emergencyContacts: emergencyContacts.map((contact) => ({
      relation: contact.relation.trim(),
      name: contact.name.trim(),
      phone: contact.phone.trim(),
      email: contact.email.trim(),
    })),

    bloodDonorStatus: form.bloodDonorStatus,

    bloodDonationCompensation: form.bloodDonationCompensation,

    lastBloodDonation: buildDonationDate(
      form.lastBloodDonation.month,
      form.lastBloodDonation.year,
    ),

    location: {
      district: form.location.district,
      upazila: form.location.upazila,
      streetAddress: form.location.streetAddress.trim(),
    },

    bloodDonationContactNumber: form.bloodDonationContactNumber.trim(),
  };
}

