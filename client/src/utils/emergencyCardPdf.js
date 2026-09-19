import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const CARD_WIDTH_MM = 85.6;
const CARD_HEIGHT_MM = 53.98;

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

const CARD_SCALE = 4;

const FONT_REGULAR = "/fonts/NotoSansBengali-Regular.ttf";
const FONT_BOLD = "/fonts/NotoSansBengali-Bold.ttf";

const escapeHtml = (value) => {
  if (value === null || value === undefined) return "";

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const normalize = (value) => {
  if (value === null || value === undefined) return "";
  return String(value).trim();
};

const getFullName = (userInfo) => {
  return (
    normalize(userInfo?.name) ||
    normalize(userInfo?.fullName) ||
    normalize(userInfo?.username) ||
    "Not provided"
  );
};

const formatDate = (value) => {
  if (!value) return "Not provided";

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

const formatGender = (value) => {
  if (!value) return "Not provided";

  return value;
};

const formatBloodGroup = (value) => {
  return normalize(value) || "Not provided";
};

const getChronicIllnesses = (profile) => {
  if (!Array.isArray(profile?.chronicIllnesses)) {
    return [];
  }

  return profile.chronicIllnesses
    .map(normalize)
    .filter(Boolean);
};

const getEmergencyContacts = (profile) => {
  if (!Array.isArray(profile?.emergencyContacts)) {
    return [];
  }

  return profile.emergencyContacts
    .map((contact) => ({
      name: normalize(contact?.name),
      relation: normalize(contact?.relation),
      phone: normalize(contact?.phone),
    }))
    .filter((contact) => contact.name || contact.phone || contact.relation)
    .slice(0, 3);
};

const getLocation = (profile) => {
  const district = normalize(profile?.location?.district);
  const upazila = normalize(profile?.location?.upazila);

  if (district && upazila) {
    return `${upazila}, ${district}`;
  }

  if (district) {
    return district;
  }

  if (upazila) {
    return upazila;
  }

  return "Not provided";
};

const createField = (label, value, extraClass = "") => {
  return `
    <div class="field ${extraClass}">
      <div class="field-label">${escapeHtml(label)}</div>
      <div class="field-value">${escapeHtml(value || "Not provided")}</div>
    </div>
  `;
};

const createContact = (contact) => {
  const name = contact.name || "Not provided";
  const relation = contact.relation || "Emergency Contact";
  const phone = contact.phone || "Not provided";

  return `
    <div class="contact">
      <div class="contact-main">
        <div class="contact-name">${escapeHtml(name)}</div>
        <div class="contact-relation">${escapeHtml(relation)}</div>
      </div>

      <div class="contact-phone">
        ${escapeHtml(phone)}
      </div>
    </div>
  `;
};

const buildFrontHtml = ({ profile, userInfo }) => {
  const fullName = getFullName(userInfo);
  const dob = formatDate(profile?.dob);
  const gender = formatGender(profile?.gender);
  const bloodGroup = formatBloodGroup(profile?.bloodGroup);

  const chronicIllnesses = getChronicIllnesses(profile);

  const illnessText = chronicIllnesses.length
    ? chronicIllnesses.join(", ")
    : "None provided";

  return `
    <div class="card front-card">
      <div class="top-strip">
        <div class="brand">
          <div class="brand-mark">M</div>

          <div>
            <div class="brand-name">MediSync</div>
            <div class="card-title">Emergency Medical Card</div>
          </div>
        </div>

        <div class="side-label">FRONT</div>
      </div>

      <div class="front-content">
        <div class="identity">
          <div class="name">${escapeHtml(fullName)}</div>
          <div class="subtitle">Personal Emergency Information</div>
        </div>

        <div class="blood-section">
          <div class="blood-label">BLOOD GROUP</div>
          <div class="blood-value">${escapeHtml(bloodGroup)}</div>
        </div>

        <div class="divider"></div>

        <div class="grid-2">
          ${createField("Date of Birth", dob)}
          ${createField("Gender", gender)}
        </div>

        <div class="condition-box">
          <div class="condition-label">IMPORTANT MEDICAL CONDITIONS</div>
          <div class="condition-value">
            ${escapeHtml(illnessText)}
          </div>
        </div>
      </div>

      <div class="footer">
        <span>Emergency medical information</span>
        <span>Not a government ID</span>
      </div>
    </div>
  `;
};

const buildBackHtml = ({ profile }) => {
  const contacts = getEmergencyContacts(profile);

  const allergies = normalize(profile?.allergies) || "None provided";
  const surgeries = normalize(profile?.surgeries) || "None provided";
  const location = getLocation(profile);

  const contactsHtml = contacts.length
    ? contacts.map(createContact).join("")
    : `
      <div class="empty-contact">
        No emergency contact provided
      </div>
    `;

  return `
    <div class="card back-card">
      <div class="top-strip">
        <div>
          <div class="back-title">Emergency Information</div>
          <div class="back-subtitle">
            Please contact the people below in an emergency.
          </div>
        </div>

        <div class="side-label">BACK</div>
      </div>

      <div class="back-content">
        <div class="section-heading">EMERGENCY CONTACTS</div>

        <div class="contacts">
          ${contactsHtml}
        </div>

        <div class="divider"></div>

        <div class="compact-grid">
          <div class="compact-item">
            <div class="compact-label">ALLERGIES</div>
            <div class="compact-value">
              ${escapeHtml(allergies)}
            </div>
          </div>

          <div class="compact-item">
            <div class="compact-label">SURGERIES</div>
            <div class="compact-value">
              ${escapeHtml(surgeries)}
            </div>
          </div>
        </div>

        <div class="location-row">
          <span class="location-label">LOCATION</span>
          <span class="location-value">${escapeHtml(location)}</span>
        </div>
      </div>

      <div class="footer">
        <span>Keep this card with you</span>
        <span>Not a government ID</span>
      </div>
    </div>
  `;
};

const createIsolatedDocument = () => {
  const iframe = document.createElement("iframe");

  iframe.setAttribute("aria-hidden", "true");

  iframe.style.position = "fixed";
  iframe.style.left = "-10000px";
  iframe.style.top = "0";
  iframe.style.width = "1000px";
  iframe.style.height = "1000px";
  iframe.style.border = "0";
  iframe.style.opacity = "0";
  iframe.style.pointerEvents = "none";

  document.body.appendChild(iframe);

  const iframeDocument =
    iframe.contentDocument || iframe.contentWindow?.document;

  if (!iframeDocument) {
    iframe.remove();
    throw new Error("Unable to create isolated PDF document.");
  }

  return {
    iframe,
    document: iframeDocument,
  };
};

const getStyles = () => `
  @font-face {
    font-family: "NotoBengali";
    src: url("${FONT_REGULAR}") format("truetype");
    font-weight: 400;
    font-style: normal;
    font-display: block;
  }

  @font-face {
    font-family: "NotoBengali";
    src: url("${FONT_BOLD}") format("truetype");
    font-weight: 700;
    font-style: normal;
    font-display: block;
  }

  * {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    background: #ffffff;
  }

  body {
    font-family: "NotoBengali", Arial, sans-serif;
  }

  .render-area {
    width: 1000px;
    min-height: 1000px;
    padding: 40px;
    background: #ffffff;
  }

  .card {
    width: 85.6mm;
    height: 53.98mm;
    position: relative;
    overflow: hidden;

    background: #ffffff;
    color: #0f172a;

    border: 0.35mm solid #cbd5e1;
    border-radius: 3mm;

    font-family: "NotoBengali", Arial, sans-serif;

    box-shadow: none;
  }

  .front-card {
    padding: 0;
  }

  .back-card {
    padding: 0;
  }

  .top-strip {
    height: 11.5mm;
    padding: 2.6mm 3.5mm;

    display: flex;
    align-items: center;
    justify-content: space-between;

    background: #f0f9ff;
    border-bottom: 0.3mm solid #bae6fd;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 2.2mm;
  }

  .brand-mark {
    width: 6.7mm;
    height: 6.7mm;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 1.7mm;

    background: #0284c7;
    color: #ffffff;

    font-size: 4.2mm;
    font-weight: 700;
  }

  .brand-name {
    font-size: 3.1mm;
    font-weight: 700;
    color: #0f172a;
  }

  .card-title {
    margin-top: 0.7mm;

    font-size: 2.05mm;

    color: #475569;
    font-weight: 400;
  }

  .side-label {
    padding: 1mm 1.8mm;

    border: 0.25mm solid #bae6fd;
    border-radius: 1.2mm;

    color: #0369a1;
    background: #ffffff;

    font-size: 1.8mm;
    font-weight: 700;
    letter-spacing: 0.15mm;
  }

  .front-content {
    padding: 3.2mm 3.5mm 2.5mm;
  }

  .identity {
    width: 70%;
  }

  .name {
    font-size: 4.8mm;
    font-weight: 700;
    color: #0f172a;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .subtitle {
    margin-top: 0.9mm;

    font-size: 1.8mm;

    color: #64748b;
  }

  .blood-section {
    position: absolute;

    top: 15.2mm;
    right: 3.5mm;

    width: 19mm;
    min-height: 13.5mm;

    padding: 1.7mm 1.5mm;

    border: 0.3mm solid #fecaca;
    border-radius: 2mm;

    background: #fff7f7;

    text-align: center;
  }

  .blood-label {
    font-size: 1.45mm;

    color: #991b1b;
    font-weight: 700;
    letter-spacing: 0.08mm;
  }

  .blood-value {
    margin-top: 1mm;

    font-size: 4.5mm;

    color: #b91c1c;
    font-weight: 700;
  }

  .divider {
    height: 0.25mm;
    margin: 2.4mm 0;

    background: #e2e8f0;
  }

  .grid-2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3mm;

    padding-right: 21mm;
  }

  .field {
    min-width: 0;
  }

  .field-label {
    font-size: 1.55mm;

    color: #64748b;
    font-weight: 700;

    text-transform: uppercase;
    letter-spacing: 0.06mm;
  }

  .field-value {
    margin-top: 0.8mm;

    font-size: 2.35mm;

    color: #0f172a;
    font-weight: 400;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .condition-box {
    margin-top: 2.5mm;

    padding: 1.9mm 2mm;

    min-height: 9mm;

    border: 0.25mm solid #dbeafe;
    border-radius: 1.8mm;

    background: #f8fbff;
  }

  .condition-label {
    font-size: 1.5mm;

    color: #0369a1;
    font-weight: 700;

    letter-spacing: 0.05mm;
  }

  .condition-value {
    margin-top: 0.9mm;

    font-size: 2.05mm;

    color: #1e293b;

    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .back-title {
    font-size: 3.3mm;

    color: #0f172a;
    font-weight: 700;
  }

  .back-subtitle {
    margin-top: 0.6mm;

    font-size: 1.65mm;

    color: #64748b;
  }

  .back-content {
    padding: 2.5mm 3.5mm 2mm;
  }

  .section-heading {
    font-size: 1.55mm;

    color: #0369a1;
    font-weight: 700;

    letter-spacing: 0.08mm;
  }

  .contacts {
    margin-top: 1.3mm;
  }

  .contact {
    min-height: 7.2mm;

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 1.05mm 1.6mm;

    border: 0.25mm solid #e2e8f0;
    border-radius: 1.5mm;

    background: #f8fafc;

    margin-bottom: 1.05mm;
  }

  .contact-main {
    min-width: 0;
    padding-right: 2mm;
  }

  .contact-name {
    font-size: 2.1mm;

    color: #0f172a;
    font-weight: 700;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .contact-relation {
    margin-top: 0.45mm;

    font-size: 1.55mm;

    color: #64748b;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .contact-phone {
    flex-shrink: 0;

    font-size: 1.85mm;

    color: #0369a1;
    font-weight: 700;

    white-space: nowrap;
  }

  .empty-contact {
    padding: 2mm;

    border: 0.25mm dashed #cbd5e1;
    border-radius: 1.5mm;

    font-size: 1.8mm;
    color: #64748b;
  }

  .compact-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3mm;
  }

  .compact-item {
    min-width: 0;
  }

  .compact-label {
    font-size: 1.45mm;

    color: #64748b;
    font-weight: 700;

    letter-spacing: 0.05mm;
  }

  .compact-value {
    margin-top: 0.7mm;

    font-size: 1.8mm;

    color: #1e293b;

    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .location-row {
    margin-top: 1.8mm;

    display: flex;
    align-items: baseline;
    gap: 2mm;

    min-width: 0;
  }

  .location-label {
    flex-shrink: 0;

    font-size: 1.45mm;

    color: #64748b;
    font-weight: 700;

    letter-spacing: 0.05mm;
  }

  .location-value {
    min-width: 0;

    font-size: 1.8mm;

    color: #1e293b;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .footer {
    position: absolute;
    left: 3.5mm;
    right: 3.5mm;
    bottom: 1.7mm;

    display: flex;
    align-items: center;
    justify-content: space-between;

    font-size: 1.35mm;

    color: #94a3b8;
  }
`;

const waitForFonts = async (doc) => {
  if (!doc.fonts) {
    return;
  }

  try {
    await doc.fonts.load(`400 16px "NotoBengali"`);
    await doc.fonts.load(`700 16px "NotoBengali"`);
    await doc.fonts.ready;
  } catch (error) {
    console.warn("Emergency card fonts could not be fully loaded:", error);
  }
};

const renderCard = async (html) => {
  const { iframe, document: iframeDocument } = createIsolatedDocument();

  try {
    iframeDocument.open();

    iframeDocument.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <style>
            ${getStyles()}
          </style>
        </head>

        <body>
          <div class="render-area">
            ${html}
          </div>
        </body>
      </html>
    `);

    iframeDocument.close();

    await new Promise((resolve) => {
      if (iframeDocument.readyState === "complete") {
        resolve();
        return;
      }

      iframe.onload = resolve;
    });

    await waitForFonts(iframeDocument);

    // Give the browser one additional rendering frame so Bengali
    // glyphs and dimensions are fully resolved before capture.
    await new Promise((resolve) => {
      iframe.contentWindow.requestAnimationFrame(() => {
        iframe.contentWindow.requestAnimationFrame(resolve);
      });
    });

    const card = iframeDocument.querySelector(".card");

    if (!card) {
      throw new Error("Emergency card element was not created.");
    }

    const canvas = await html2canvas(card, {
      scale: CARD_SCALE,

      backgroundColor: "#ffffff",

      useCORS: true,
      allowTaint: false,

      logging: false,

      imageTimeout: 0,

      // Prevent html2canvas from inheriting the application's
      // Tailwind-generated CSS.
      windowWidth: card.offsetWidth,
      windowHeight: card.offsetHeight,
    });

    return canvas;
  } finally {
    iframe.remove();
  }
};

const addCardToPdf = (pdf, canvas, x, y) => {
  const imageData = canvas.toDataURL("image/png", 1.0);

  pdf.addImage(
    imageData,
    "PNG",
    x,
    y,
    CARD_WIDTH_MM,
    CARD_HEIGHT_MM,
    undefined,
    "FAST"
  );
};

export async function generateEmergencyCardPdf(profile, userInfo) {
  if (!profile && !userInfo) {
    throw new Error("Profile information is unavailable.");
  }

  const frontHtml = buildFrontHtml({
    profile,
    userInfo,
  });

  const backHtml = buildBackHtml({
    profile,
  });

  let frontCanvas;
  let backCanvas;

  try {
    [frontCanvas, backCanvas] = await Promise.all([
      renderCard(frontHtml),
      renderCard(backHtml),
    ]);

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });

    const cardX = (A4_WIDTH_MM - CARD_WIDTH_MM) / 2;

    const frontY = 55;
    const backY = 155;

    // FRONT
    addCardToPdf(
      pdf,
      frontCanvas,
      cardX,
      frontY
    );

    // BACK
    addCardToPdf(
      pdf,
      backCanvas,
      cardX,
      backY
    );

    // Print/cutting guides outside the actual cards.
    pdf.setDrawColor(148, 163, 184);
    pdf.setLineWidth(0.2);

    // Front guide
    pdf.rect(
      cardX,
      frontY,
      CARD_WIDTH_MM,
      CARD_HEIGHT_MM
    );

    // Back guide
    pdf.rect(
      cardX,
      backY,
      CARD_WIDTH_MM,
      CARD_HEIGHT_MM
    );

    // Instructions
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);

    pdf.text(
      "Print at 100% / Actual Size. Do not use Fit to Page.",
      A4_WIDTH_MM / 2,
      25,
      {
        align: "center",
      }
    );

    pdf.text(
      "Cut along the card borders. Use the front and back sides together.",
      A4_WIDTH_MM / 2,
      30,
      {
        align: "center",
      }
    );

    pdf.setFontSize(7);

    pdf.text(
      "Front",
      cardX,
      frontY - 3
    );

    pdf.text(
      "Back",
      cardX,
      backY - 3
    );

    pdf.save("medisync-emergency-card.pdf");
  } catch (error) {
    console.error("Emergency card PDF generation failed:", error);
    throw error;
  }
}