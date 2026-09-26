// client/src/utils/emergencyWhatsApp.js

// Normalizes Bangladesh phone numbers into WhatsApp-compatible format.

function normalizeBangladeshPhone(phone) {
  if (!phone) return null;

  let normalized = String(phone).trim();

  normalized = normalized.replace(/\D/g, "");

  // Converts local 01XXXXXXXXX numbers into the 880 country-code format.
  if (normalized.startsWith("01")) {
    normalized = `88${normalized}`;
  }

  if (normalized.startsWith("880")) {
    return normalized;
  }

  return null;
}

// Opens WhatsApp with a fixed MediSync emergency assistance message.
export function openEmergencyWhatsApp(phone) {
  const normalizedPhone = normalizeBangladeshPhone(phone);

  if (!normalizedPhone) {
    return;
  }

  const message =
    "আমি অনেক অসুস্থ বোধ করছি এবং আমার এখন সাহায্য দরকার। দয়া করে আমার সাথে দ্রুত যোগাযোগ করুন।";

  const whatsappUrl =
    `https://wa.me/${normalizedPhone}` + `?text=${encodeURIComponent(message)}`;

  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
}
