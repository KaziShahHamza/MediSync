// server/utils/profileHelpers.js

// Provides profile field extraction, name normalization, and Cloudinary photo cleanup.

import { v2 as cloudinary } from "cloudinary";

// Defines fields accepted by profile create and update requests.
export const allowedProfileFields = [
  "dob",
  "gender",
  "height",
  "bloodGroup",
  "location",
  "allergies",
  "chronicIllnesses",
  "surgeries",
  "emergencyContacts",
  "bloodDonorStatus",
  "bloodDonationCompensation",
  "lastBloodDonation",
  "bloodDonationContactNumber",
];

// Extracts only fields permitted in profile data.
export function getProfileData(body) {
  return Object.fromEntries(
    allowedProfileFields
      .filter((field) =>
        Object.prototype.hasOwnProperty.call(body, field),
      )
      .map((field) => [
        field,
        body[field],
      ]),
  );
}

// Normalizes optional user names before database updates.
export function getTrimmedName(name) {
  return name?.trim() || "";
}

// Configure Cloudinary from environment variables.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Removes a profile image using its Cloudinary public ID.
export async function deleteProfilePhoto(publicId) {
  return cloudinary.uploader.destroy(
    publicId,
    {
      resource_type: "image",
    },
  );
}