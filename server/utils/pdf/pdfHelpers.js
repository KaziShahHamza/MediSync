// server/utils/pdf/pdfHelpers.js

// Provides reusable date, value formatting, age calculation, and image loading helpers.
// Keeps common PDF formatting and validation logic outside individual report sections.

import axios from "axios";

// Calculates the current age from a valid date of birth.
export function calculateAge(dob) {
  if (!dob) {
    return null;
  }

  const birthDate = new Date(dob);

  if (Number.isNaN(birthDate.getTime())) {
    return null;
  }

  const today = new Date();

  // Reject future dates of birth.
  if (birthDate > today) {
    return null;
  }

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDifference = today.getMonth() - birthDate.getMonth();
  const dayDifference = today.getDate() - birthDate.getDate();

  // Adjust the result when the birthday has not occurred this year.
  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age--;
  }

  return age >= 0 ? age : null;
}

// Formats a valid date consistently for generated PDF documents.
export function formatDate(date) {
  if (!date) {
    return "Not available";
  }

  const normalizedDate = new Date(date);

  if (Number.isNaN(normalizedDate.getTime())) {
    return "Not available";
  }

  return normalizedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Returns a fallback value when the supplied value is empty or invalid.
export function formatValue(value, fallback = "Not available") {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return value;
}

// Downloads a remote image and converts it into a PDF-compatible buffer.
export async function getImageBuffer(imageUrl) {
  if (typeof imageUrl !== "string" || !imageUrl.trim()) {
    return null;
  }

  let parsedUrl;

  try {
    parsedUrl = new URL(imageUrl.trim());
  } catch {
    console.error("Invalid prescription image URL:", imageUrl);

    return null;
  }

  // Allow only HTTP and HTTPS image sources.
  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    console.error("Unsupported prescription image URL protocol:", imageUrl);

    return null;
  }

  try {
    const response = await axios.get(parsedUrl.toString(), {
      responseType: "arraybuffer",
      timeout: 10000,
      maxContentLength: 10 * 1024 * 1024,
      maxBodyLength: 10 * 1024 * 1024,
    });

    return Buffer.from(response.data);
  } catch (error) {
    console.error("Failed to download prescription image:", imageUrl);

    return null;
  }
}

// Formats the generation timestamp displayed in the report.
export function formatExportDateTime(date = new Date()) {
  const normalizedDate = date instanceof Date ? date : new Date(date);

  if (Number.isNaN(normalizedDate.getTime())) {
    return formatExportDateTime(new Date());
  }

  const day = normalizedDate.getDate();

  const month = normalizedDate.toLocaleString("en-US", {
    month: "long",
  });

  const year = normalizedDate.getFullYear();

  const time = normalizedDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${day} ${month}, ${year} at ${time}`;
}

// Returns a safe array for optional collection fields.
export function toArray(value) {
  return Array.isArray(value) ? value : [];
}

// Converts a value into a readable string for PDF output.
export function toText(value, fallback = "Not available") {
  const normalizedValue = formatValue(value, fallback);

  if (typeof normalizedValue === "object") {
    return fallback;
  }

  return String(normalizedValue);
}
