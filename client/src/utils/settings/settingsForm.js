// client/src/utils/settings/settingsForm.js

// Defines settings form state and transforms profile data to and from the form.
// Keeps form structure and API payload preparation separate from reusable helpers.

import { buildDonationDate } from "./settingsHelpers";

export const createEmptyContact = () => ({
  relation: "",
  name: "",
  phone: "",
  email: "",
});

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

    lastBloodDonation: {
      month: "",
      year: "",
    },

    bloodDonationContactNumber: profile?.bloodDonationContactNumber || "",
  };
}

// Converts settings form state into the profile API payload.
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
