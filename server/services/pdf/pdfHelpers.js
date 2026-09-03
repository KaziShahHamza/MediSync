export function calculateAge(dob) {
  if (!dob) return null;
  const birthDate = new Date(dob);
  if (Number.isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  const dayDifference = today.getDate() - birthDate.getDate();

  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age--;
  }
  return age >= 0 ? age : null;
}

export function formatDate(date) {
  if (!date) return "Not available";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Not available";

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatMonthYear(date) {
  if (!date) return "Unknown";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "Unknown";

  return parsedDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function formatValue(value, fallback = "Not available") {
  return value !== null && value !== undefined && value !== "" ? value : fallback;
}

export function formatExportDateTime(date = new Date()) {
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();
  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${day} ${month}, ${year} at ${time}`;
}

export function getPageContentWidth(doc) {
  return doc.page.width - doc.page.margins.left - doc.page.margins.right;
}

export function getPageContentHeight(doc) {
  return doc.page.height - doc.page.margins.top - doc.page.margins.bottom;
}

export function ensureSpace(doc, requiredHeight = 100) {
  const bottomLimit = doc.page.height - doc.page.margins.bottom - requiredHeight;
  if (doc.y > bottomLimit) {
    doc.addPage();
    return true;
  }
  return false;
}