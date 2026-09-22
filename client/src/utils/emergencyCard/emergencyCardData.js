// client/src/utils/emergencyCard/emergencyCardData.js

// Utility functions for parsing, formatting, and sanitizing user emergency data.
// Prepares medical history, emergency contacts, and personal information for display.

// Normalizes null/undefined values to clean trimmed strings
const normalize = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
};

// Escapes special characters for safe HTML insertion
export const escapeHtml = (value) => {
  return normalize(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

// Extracts display full name from user info
export const getFullName = (userInfo) => {
  return (
    normalize(userInfo?.name) ||
    normalize(userInfo?.fullName) ||
    normalize(userInfo?.username) ||
    "Not provided"
  );
};

// Formats date strings into DD MMM YYYY format
export const formatDate = (value) => {
  if (!value) {
    return "Not provided";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not provided";
  }

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Gets blood group string
export const getBloodGroup = (profile) => {
  return normalize(profile?.bloodGroup) || "Not provided";
};

// Gets gender string
export const getGender = (profile) => {
  return normalize(profile?.gender) || "Not provided";
};

// Gets profile photo URL
export const getProfilePhoto = (userInfo) => {
  return normalize(userInfo?.profilePhotoUrl);
};

// Parses chronic illnesses list
export const getChronicIllnesses = (profile) => {
  if (!Array.isArray(profile?.chronicIllnesses)) {
    return [];
  }

  return profile.chronicIllnesses.map(normalize).filter(Boolean);
};

// Filters and limits emergency contacts list
export const getEmergencyContacts = (profile) => {
  if (!Array.isArray(profile?.emergencyContacts)) {
    return [];
  }

  return profile.emergencyContacts
    .map((contact) => ({
      name: normalize(contact?.name),
      relation: normalize(contact?.relation),
      phone: normalize(contact?.phone),
      email: normalize(contact?.email),
    }))
    .filter(
      (contact) =>
        contact.name || contact.phone || contact.relation || contact.email,
    )
    .slice(0, 3);
};

// Splits emergency contacts between card front and back
export const splitEmergencyContacts = (profile) => {
  const contacts = getEmergencyContacts(profile);

  return {
    frontContacts: contacts.slice(0, 2),
    backContacts: contacts.slice(2, 3),
  };
};

// Extracts individual location attributes
export const getLocationParts = (profile) => {
  return {
    streetAddress: normalize(profile?.location?.streetAddress),
    upazila: normalize(profile?.location?.upazila),
    district: normalize(profile?.location?.district),
  };
};

// Builds single address string from components
export const getLocation = (profile) => {
  const { streetAddress, upazila, district } = getLocationParts(profile);

  return (
    [streetAddress, upazila, district].filter(Boolean).join(", ") ||
    "Not provided"
  );
};

// Formats comprehensive medical history strings
export const getMedicalInformation = (profile) => {
  const illnesses = getChronicIllnesses(profile);

  return {
    chronicIllnesses: illnesses,
    illnessText: illnesses.length ? illnesses.join(", ") : "None provided",

    allergies: normalize(profile?.allergies) || "None provided",

    surgeries: normalize(profile?.surgeries) || "None provided",
  };
};
