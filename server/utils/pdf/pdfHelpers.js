// server/utils/pdf/pdfHelpers.js

// Provides reusable date, value formatting, age calculation, and image loading helpers for PDF exports.

import axios from "axios";

// Calculates the current age from a date of birth.
export function calculateAge(dob) {
  if (!dob) return null;

  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDifference = today.getMonth() - birthDate.getMonth();
  const dayDifference = today.getDate() - birthDate.getDate();

  // Adjust the result when the birthday has not occurred this year.
  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age--;
  }

  return age;
}

// Formats dates consistently for generated PDF documents.
export function formatDate(date) {
  if (!date) return "Not available";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Returns a fallback value when the supplied value is empty.
export function formatValue(value, fallback = "Not available") {
  return value !== null && value !== undefined && value !== ""
    ? value
    : fallback;
}

// Downloads a remote image and converts it into a PDF-compatible buffer.
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
