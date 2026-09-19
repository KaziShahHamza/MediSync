import {
  escapeHtml,
  formatDate,
  getBloodGroup,
  getGender,
  getFullName,
  getLocation,
  getLocationParts,
  getProfilePhoto,
  getMedicalInformation,
} from "./emergencyCardData";

const FONT_REGULAR = "/fonts/NotoSansBengali-Regular.ttf";
const FONT_BOLD = "/fonts/NotoSansBengali-Bold.ttf";

const createContact = (contact) => {
  const name = contact.name || "Not provided";
  const relation = contact.relation || "Emergency Contact";
  const phone = contact.phone || "Not provided";

  return `
    <div class="contact">
      <div class="contact-main">
        <div class="contact-name">
          ${escapeHtml(name)} | ${escapeHtml(relation)}
        </div>
      </div>

      <div class="contact-phone">
        ${escapeHtml(phone)}
      </div>
    </div>
  `;
};

const createLocation = (profile) => {
  const { streetAddress, upazila, district } = getLocationParts(profile);

  return `
    <div class="location-box">
      <div class="location-label">
        PRESENT LOCATION
      </div>

      ${
        streetAddress
          ? `
            <div class="location-line">
              <span class="location-value">
                ${escapeHtml(streetAddress)},  ${escapeHtml(upazila)}, ${escapeHtml(district)}  
              </span>
            </div>
          `
          : ""
      }



      ${
        !streetAddress && !upazila && !district
          ? `
            <div class="location-value">
              Not provided
            </div>
          `
          : ""
      }
    </div>
  `;
};

const createPhoto = (userInfo) => {
  const photoUrl = getProfilePhoto(userInfo);

  if (!photoUrl) {
    return `
      <div class="photo-placeholder">
        ${escapeHtml(getFullName(userInfo).charAt(0).toUpperCase())}
      </div>
    `;
  }

  return `
    <div class="photo-frame">
      <img
        src="${escapeHtml(photoUrl)}"
        alt="Profile photo"
        crossorigin="anonymous"
      />
    </div>
  `;
};

export const buildFrontHtml = ({ profile, userInfo, frontContacts }) => {
  const fullName = getFullName(userInfo);
  const bloodGroup = getBloodGroup(profile);
  const dob = formatDate(profile?.dob);
  const gender = getGender(profile);

  const contactsHtml = frontContacts.length
    ? frontContacts.map(createContact).join("")
    : `
      <div class="empty-contact">
        No emergency contact provided
      </div>
    `;

  return `
    <div class="card front-card">

      <div class="top-strip">

        <div class="brand">
          <div class="brand-mark">M</div>

          <div>
            <div class="brand-name">
              MediSync
            </div>

            <div class="card-title">
              Emergency Medical Card
            </div>
          </div>
        </div>

        <div class="side-label">
          FRONT
        </div>

      </div>

      <div class="front-content">

        <div class="identity-row">

          ${createPhoto(userInfo)}

          <div class="identity">

            <div class="name">
              ${escapeHtml(fullName)}
            </div>

           

            <div class="basic-info">

              <div class="basic-item">
                <div class="basic-label">DATE OF BIRTH</div>
                <div class="basic-value">
                  ${escapeHtml(dob)}
                </div>
              </div>

              <div class="basic-item">
                <div class="basic-label">GENDER</div>
                <div class="basic-value">
                  ${escapeHtml(gender)}
                </div>
              </div>

            </div>

          </div>

          <div class="blood-section">

            <div class="blood-label">
              BLOOD GROUP
            </div>

            <div class="blood-value">
              ${escapeHtml(bloodGroup)}
            </div>

          </div>

        </div>

        <div class="front-section-title">
        EMERGENCY CONTACTS
        </div>
        
        <div class="contacts front-contacts">
        ${contactsHtml}
        </div>

        ${createLocation(profile)}

      </div>

      <div class="footer">
        <span>Emergency medical information</span>
        <span>Not a government ID</span>
      </div>

    </div>
  `;
};

export const buildBackHtml = ({ profile, backContacts }) => {
  const { chronicIllnesses, allergies, surgeries } =
    getMedicalInformation(profile);

  const backContactsHtml = backContacts.length
    ? `
      <div class="back-contact-section">
        <div class="section-heading">
          ADDITIONAL EMERGENCY CONTACT
        </div>

        <div class="contacts">
          ${backContacts.map(createContact).join("")}
        </div>
      </div>
    `
    : "";

  return `
    <div class="card back-card">

      <div class="top-strip">

        <div>
          <div class="back-title">
            Medical Information
          </div>

          <div class="back-subtitle">
            Important information for emergency situations.
          </div>
        </div>

        <div class="side-label">
          BACK
        </div>

      </div>

      <div class="back-content">

        ${backContactsHtml}

        <div class="section-heading">
          IMPORTANT MEDICAL INFORMATION
        </div>

        <div class="medical-grid">

          <div class="medical-item medical-item-full">

            <div class="medical-label">
              CHRONIC ILLNESSES
            </div>

            <div class="medical-value">
              ${escapeHtml(
                chronicIllnesses.length
                  ? chronicIllnesses.join(", ")
                  : "None provided",
              )}
            </div>

          </div>

          <div class="medical-item">

            <div class="medical-label">
              ALLERGIES
            </div>

            <div class="medical-value">
              ${escapeHtml(allergies)}
            </div>

          </div>

          <div class="medical-item">

            <div class="medical-label">
              PREVIOUS SURGERIES
            </div>

            <div class="medical-value">
              ${escapeHtml(surgeries)}
            </div>

          </div>

        </div>

        <div class="medical-note">
          This card contains user-provided emergency
          medical information. It is not a diagnosis,
          prescription, or government identification document.
        </div>

      </div>

      <div class="footer">
        <span>Keep this card with you</span>
        <span>Not a government ID</span>
      </div>

    </div>
  `;
};

export const getStyles = () => `
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
  }

  .top-strip {
    height: 10.5mm;
    padding: 2.2mm 3.5mm;

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
    width: 6.5mm;
    height: 6.5mm;

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
    margin-top: 0.5mm;
    font-size: 1.9mm;
    color: #475569;
  }

  .side-label {
    padding: 0.9mm 1.6mm;

    border: 0.25mm solid #bae6fd;
    border-radius: 1.2mm;

    color: #0369a1;
    background: #ffffff;

    font-size: 1.7mm;
    font-weight: 700;
    letter-spacing: 0.15mm;
  }

  .front-content {
    padding: 2.6mm 3.5mm 1.5mm;
  }

  .identity-row {
    position: relative;

    display: flex;
    align-items: center;

    min-height: 17mm;
    padding-right: 21mm;
  }

  .photo-frame,
  .photo-placeholder {
    width: 15mm;
    height: 15mm;

    flex-shrink: 0;

    border-radius: 2mm;
    overflow: hidden;

    border: 0.3mm solid #cbd5e1;
    background: #e0f2fe;
  }

  .photo-frame img {
    width: 100%;
    height: 100%;
    display: block;

    object-fit: cover;
  }

  .photo-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;

    color: #0369a1;

    font-size: 6mm;
    font-weight: 700;
  }

  .identity {
    min-width: 0;
    margin-left: 2.5mm;
  }

  .name {
    max-width: 42mm;

    font-size: 4.2mm;
    font-weight: 700;
    color: #0f172a;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .subtitle {
    margin-top: 0.7mm;

    font-size: 1.7mm;
    color: #64748b;
  }

  .basic-info {
    display: flex;
    gap: 4mm;
    margin-top: 1.5mm;
  }

  .basic-item {
    min-width: 0;
  }

  .basic-label {
    font-size: 1.25mm;
    color: #64748b;
    font-weight: 700;
    letter-spacing: 0.04mm;
  }

  .basic-value {
    margin-top: 0.4mm;

    font-size: 1.75mm;
    color: #0f172a;

    white-space: nowrap;
  }

  .blood-section {
    position: absolute;

    top: 1.3mm;
    right: 0;

    width: 17.5mm;
    min-height: 13mm;

    padding: 1.4mm 1.2mm;

    border: 0.3mm solid #fecaca;
    border-radius: 2mm;

    background: #fff7f7;
    text-align: center;
  }

  .blood-label {
    font-size: 1.25mm;
    color: #991b1b;
    font-weight: 700;
    letter-spacing: 0.06mm;
  }

  .blood-value {
    margin-top: 0.8mm;

    font-size: 4.2mm;
    color: #b91c1c;
    font-weight: 700;
  }

  .location-box {
    margin-top: 1.6mm;

    padding: 1.6mm 2mm;

    border: 0.25mm solid #dbeafe;
    border-radius: 1.7mm;

    background: #f8fbff;
  }

  .location-label {
    font-size: 1.35mm;
    color: #0369a1;
    font-weight: 700;
    letter-spacing: 0.06mm;
  }

  .location-line {
    display: flex;
    align-items: baseline;

    gap: 1.5mm;
    margin-top: 0.6mm;

    min-width: 0;
  }

  .location-key {
    flex-shrink: 0;

    width: 10mm;

    font-size: 1.3mm;
    color: #64748b;
    font-weight: 700;
  }

  .location-value {
    min-width: 0;

    font-size: 1.65mm;
    color: #1e293b;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .front-section-title {
    margin-top: 1.7mm;

    font-size: 1.35mm;
    color: #0369a1;
    font-weight: 700;
    letter-spacing: 0.06mm;
  }

  .contacts {
    margin-top: 0.8mm;
  }

  .contact {
    min-height: 5.9mm;

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 0.75mm 1.4mm;

    border: 0.25mm solid #e2e8f0;
    border-radius: 1.3mm;

    background: #f8fafc;

    margin-bottom: 0.7mm;
  }

  .contact-main {
    min-width: 0;
    padding-right: 2mm;
  }

  .contact-name {
    font-size: 1.8mm;
    color: #0f172a;
    font-weight: 700;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .contact-relation {
    margin-top: 0.2mm;

    font-size: 1.25mm;
    color: #64748b;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .contact-phone {
    flex-shrink: 0;

    font-size: 1.65mm;
    color: #0369a1;
    font-weight: 700;

    white-space: nowrap;
  }

  .empty-contact {
    padding: 1.3mm;

    border: 0.25mm dashed #cbd5e1;
    border-radius: 1.3mm;

    font-size: 1.5mm;
    color: #64748b;
  }

  .footer {
    position: absolute;

    left: 3.5mm;
    right: 3.5mm;
    bottom: 1.5mm;

    display: flex;
    align-items: center;
    justify-content: space-between;

    font-size: 1.2mm;
    color: #94a3b8;
  }

  /* BACK */

  .back-title {
    font-size: 3mm;
    color: #0f172a;
    font-weight: 700;
  }

  .back-subtitle {
    margin-top: 0.4mm;

    font-size: 1.5mm;
    color: #64748b;
  }

  .back-content {
    padding: 2.2mm 3.5mm 1.5mm;
  }

  .section-heading {
    font-size: 1.4mm;
    color: #0369a1;
    font-weight: 700;
    letter-spacing: 0.07mm;
  }

  .back-contact-section {
    margin-bottom: 1.7mm;
  }

  .medical-grid {
    display: grid;

    grid-template-columns: 1fr 1fr;

    gap: 1.8mm;

    margin-top: 1mm;
  }

  .medical-item {
    min-width: 0;

    padding: 1.5mm;

    border: 0.25mm solid #e2e8f0;
    border-radius: 1.5mm;

    background: #f8fafc;
  }

  .medical-item-full {
    grid-column: 1 / -1;
  }

  .medical-label {
    font-size: 1.3mm;
    color: #64748b;
    font-weight: 700;
    letter-spacing: 0.05mm;
  }

  .medical-value {
    margin-top: 0.7mm;

    font-size: 1.75mm;
    color: #1e293b;

    line-height: 1.35;

    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;

    overflow: hidden;
  }

  .medical-note {
    margin-top: 1.6mm;

    padding: 1.5mm;

    border-left: 0.7mm solid #0284c7;

    background: #f0f9ff;

    font-size: 1.35mm;
    line-height: 1.4;

    color: #475569;
  }
`;

export const buildCardDocument = (html) => {
  return `
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
  `;
};
