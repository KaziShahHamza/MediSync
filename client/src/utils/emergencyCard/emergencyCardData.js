const normalize = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
};

export const escapeHtml = (value) => {
  return normalize(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export const getFullName = (userInfo) => {
  return (
    normalize(userInfo?.name) ||
    normalize(userInfo?.fullName) ||
    normalize(userInfo?.username) ||
    "Not provided"
  );
};

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

export const getBloodGroup = (profile) => {
  return normalize(profile?.bloodGroup) || "Not provided";
};

export const getGender = (profile) => {
  return normalize(profile?.gender) || "Not provided";
};

export const getProfilePhoto = (userInfo) => {
  return normalize(userInfo?.profilePhotoUrl);
};

export const getChronicIllnesses = (profile) => {
  if (!Array.isArray(profile?.chronicIllnesses)) {
    return [];
  }

  return profile.chronicIllnesses
    .map(normalize)
    .filter(Boolean);
};

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
        contact.name ||
        contact.phone ||
        contact.relation ||
        contact.email,
    )
    .slice(0, 3);
};

/*
 * Front page has room for a maximum of two emergency contacts.
 *
 * If the user has:
 * 0 → front 0, back 0
 * 1 → front 1, back 0
 * 2 → front 2, back 0
 * 3 → front 2, back 1
 */
export const splitEmergencyContacts = (profile) => {
  const contacts = getEmergencyContacts(profile);

  return {
    frontContacts: contacts.slice(0, 2),
    backContacts: contacts.slice(2, 3),
  };
};

export const getLocationParts = (profile) => {
  return {
    streetAddress: normalize(profile?.location?.streetAddress),
    upazila: normalize(profile?.location?.upazila),
    district: normalize(profile?.location?.district),
  };
};

export const getLocation = (profile) => {
  const { streetAddress, upazila, district } =
    getLocationParts(profile);

  return [streetAddress, upazila, district]
    .filter(Boolean)
    .join(", ") || "Not provided";
};

export const getMedicalInformation = (profile) => {
  const illnesses = getChronicIllnesses(profile);

  return {
    chronicIllnesses: illnesses,
    illnessText: illnesses.length
      ? illnesses.join(", ")
      : "None provided",

    allergies:
      normalize(profile?.allergies) || "None provided",

    surgeries:
      normalize(profile?.surgeries) || "None provided",
  };
};