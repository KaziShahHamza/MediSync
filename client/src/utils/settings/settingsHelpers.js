// client/src/utils/settings/settingsHelpers.js

// Helper utility functions for form state generation, formatting, date construction, and validation.

// Generates an empty contact template structure
export const createEmptyContact = () => ({
  relation: "",
  name: "",
  phone: "",
  email: "",
});

// Default initial state structure for settings form
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

// Extracts month and year string parameters from ISO date
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

// Converts selected month and year values into ISO date string
export function buildDonationDate(month, year) {
  if (!month || !year) {
    return null;
  }

  return new Date(Date.UTC(Number(year), Number(month) - 1, 1)).toISOString();
}

// Derives uppercase initials from user name
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

// Performs business rule validation over settings inputs
export function validateSettingsForm(form) {
  // Validate emergency contacts list inputs
  for (const contact of form.emergencyContacts) {
    if (!contact.relation.trim()) {
      return "Please select a relation for every emergency contact.";
    }

    if (!contact.name.trim()) {
      return "Please enter the name of every emergency contact.";
    }

    if (!contact.phone.trim() && !contact.email.trim()) {
      return "Each emergency contact must have a phone number or email address.";
    }

    if (
      contact.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim())
    ) {
      return `Please enter a valid email for ${contact.name}.`;
    }
  }

  const { month, year } = form.lastBloodDonation;

  // Validate complete blood donation date selection
  if ((month && !year) || (!month && year)) {
    return "Please select both the month and year of the last blood donation.";
  }

  // Ensure donation date is not in future
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

// Maps profile and user object values into form state shape
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

    chronicIllnesses: profile?.chronicIllnesses || [],

    surgeries: profile?.surgeries || "",

    emergencyContacts:
      profile?.emergencyContacts?.map((contact) => ({
        relation: contact.relation || "",
        name: contact.name || "",
        phone: contact.phone || "",
        email: contact.email || "",
      })) || [],

    bloodDonorStatus: profile?.bloodDonorStatus || "",

    bloodDonationCompensation: profile?.bloodDonationCompensation || "",

    lastBloodDonation: getDonationMonthYear(profile?.lastBloodDonation),

    bloodDonationContactNumber: profile?.bloodDonationContactNumber || "",
  };
}

// Transforms form state data into database profile payload
export function buildProfilePayload(form) {
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

    chronicIllnesses: form.chronicIllnesses,

    surgeries: form.surgeries,

    emergencyContacts: form.emergencyContacts.map((contact) => ({
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
