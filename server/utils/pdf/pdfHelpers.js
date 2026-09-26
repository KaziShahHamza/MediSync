// server/utils/pdf/pdfHelpers.js

// Provides reusable PDF formatting and image-loading helpers.
// Keeps generic PDF preparation logic outside the PDF service.

import axios from "axios";

// Calculates the user's age from their date of birth.
export function calculateAge(dob) {
  if (!dob) return null;

  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDifference = today.getMonth() - birthDate.getMonth();

  const dayDifference = today.getDate() - birthDate.getDate();

  // Reduce the age when this year's birthday has not occurred.
  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age--;
  }

  return age;
}

// Formats dates consistently throughout exported documents.
export function formatDate(date) {
  if (!date) return "Not available";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Provides a fallback for missing PDF values.
export function formatValue(value, fallback = "Not available") {
  return value !== null && value !== undefined && value !== ""
    ? value
    : fallback;
}

// Downloads a Cloudinary image for PDF embedding.
export async function getImageBuffer(imageUrl) {
  try {
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });

    return Buffer.from(response.data);
  } catch (error) {
    console.error("Failed to download prescription image:", imageUrl);

    return null;
  }
}
