// client/src/utils/emergencyCard/emergencyCardStyles.js

const FONT_REGULAR = "/fonts/NotoSansBengali-Regular.ttf";
const FONT_BOLD = "/fonts/NotoSansBengali-Bold.ttf";

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
