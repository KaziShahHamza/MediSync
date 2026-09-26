// server/utils/profileHelpers.js

// Provides profile field extraction, name normalization, and photo cleanup.
// Keeps reusable profile-related operations outside controllers and services.

import { v2 as cloudinary } from "cloudinary";

// Define fields accepted by profile create and update requests.
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

// Extract only fields permitted in profile data.
export function getProfileData(body) {
  return Object.fromEntries(
    allowedProfileFields
      .filter((field) => Object.prototype.hasOwnProperty.call(body, field))
      .map((field) => [field, body[field]]),
  );
}

// Normalize an optional user name.
export function getTrimmedName(name) {
  return name?.trim() || "";
}

// Configure Cloudinary from environment variables.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Remove a profile image from Cloudinary.
export async function deleteProfilePhoto(publicId) {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });
}
