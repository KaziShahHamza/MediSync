// client/src/utils/emergencyCard/emergencyCardTemplates.js

// Builds the front and back HTML structures for the emergency card.
// Keeps card content and layout separate from PDF rendering logic.

import {
  escapeHtml,
  formatDate,
  getBloodGroup,
  getGender,
  getFullName,
  getMedicalInformation,
} from "./emergencyCardData";

import {
  createContact,
  createLocation,
  createPhoto,
} from "./emergencyCardHelpers";

import { getStyles } from "./emergencyCardStyles";

// Generates the front side HTML template.
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
                <div class="basic-label">
                  DATE OF BIRTH
                </div>

                <div class="basic-value">
                  ${escapeHtml(dob)}
                </div>
              </div>

              <div class="basic-item">
                <div class="basic-label">
                  GENDER
                </div>

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

// Generates the back side HTML template.
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

// Wraps card HTML inside a complete isolated document.
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
