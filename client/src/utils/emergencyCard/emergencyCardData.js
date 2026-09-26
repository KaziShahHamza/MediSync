// client/src/utils/emergencyCard/emergencyCardData.js

// Provides emergency-card data normalization, formatting, and sanitization.
// Keeps profile data preparation separate from emergency-card rendering.

const normalize = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
};

// Escape values before inserting them into generated HTML.
export const escapeHtml = (value) =>
  normalize(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

// Resolve the user's display name with sensible fallbacks.
export const getFullName = (userInfo) =>
  normalize(userInfo?.name) ||
  normalize(userInfo?.fullName) ||
  normalize(userInfo?.username) ||
  "Not provided";

// Format a valid date for emergency-card display.
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

// Resolve the user's blood group.
export const getBloodGroup = (profile) =>
  normalize(profile?.bloodGroup) || "Not provided";

// Resolve the user's gender.
export const getGender = (profile) =>
  normalize(profile?.gender) || "Not provided";

// Resolve the user's profile photo URL.
export const getProfilePhoto = (userInfo) =>
  normalize(userInfo?.profilePhotoUrl);

// Normalize the chronic illness collection.
export const getChronicIllnesses = (profile) => {
  if (!Array.isArray(profile?.chronicIllnesses)) {
    return [];
  }

  return profile.chronicIllnesses.map(normalize).filter(Boolean);
};

// Normalize and limit emergency contacts for the card.
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

// Split emergency contacts between the card sides.
export const splitEmergencyContacts = (profile) => {
  const contacts = getEmergencyContacts(profile);

  return {
    frontContacts: contacts.slice(0, 2),
    backContacts: contacts.slice(2, 3),
  };
};

// Extract individual location fields from the profile.
export const getLocationParts = (profile) => ({
  streetAddress: normalize(profile?.location?.streetAddress),
  upazila: normalize(profile?.location?.upazila),
  district: normalize(profile?.location?.district),
});

// Build a display-ready location string.
export const getLocation = (profile) => {
  const { streetAddress, upazila, district } = getLocationParts(profile);

  return (
    [streetAddress, upazila, district].filter(Boolean).join(", ") ||
    "Not provided"
  );
};

// Build normalized medical history information for display.
export const getMedicalInformation = (profile) => {
  const illnesses = getChronicIllnesses(profile);

  return {
    chronicIllnesses: illnesses,
    illnessText: illnesses.length ? illnesses.join(", ") : "None provided",
    allergies: normalize(profile?.allergies) || "None provided",
    surgeries: normalize(profile?.surgeries) || "None provided",
  };
};
