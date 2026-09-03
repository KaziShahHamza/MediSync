import { ensureSpace } from "../pdfHelpers.js";
import { drawSectionHeader, PDF_COLORS } from "../pdfStyles.js";

export function renderDoctorsSection(doc, doctors = []) {
  ensureSpace(doc, 100);

  drawSectionHeader(
    doc,
    "Doctors",
    "Doctors and healthcare professionals saved in MediSync."
  );

  if (!doctors.length) {
    doc
      .font("Helvetica")
      .fontSize(13)
      .fillColor(PDF_COLORS.textMuted)
      .text("No doctors recorded.");

    doc.moveDown(1);
    return;
  }

  doctors.forEach((doctor, index) => {
    ensureSpace(doc, 80);

    const x = doc.page.margins.left;
    const width =
      doc.page.width - doc.page.margins.left - doc.page.margins.right;

    doc
      .font("Helvetica-Bold")
      .fontSize(13)
      .fillColor(PDF_COLORS.text)
      .text(`${index + 1}. ${doctor.name || "Unnamed Doctor"}`, x, doc.y, {
        width,
      });

    doc.moveDown(0.2);

    const details = [];
    if (doctor.bmdcRegNo) details.push(`BMDC Reg. No: ${doctor.bmdcRegNo}`);
    if (doctor.designation) details.push(`Designation: ${doctor.designation}`);
    if (doctor.degrees?.length) details.push(`Degrees: ${doctor.degrees.join(", ")}`);
    if (doctor.specialities?.length)
      details.push(`Specialities: ${doctor.specialities.join(", ")}`);
    if (doctor.primaryHospital)
      details.push(`Primary Hospital: ${doctor.primaryHospital}`);

    details.forEach((detail) => {
      doc
        .font("Helvetica")
        .fontSize(12)
        .fillColor(PDF_COLORS.textSecondary)
        .text(detail, x + 10, doc.y, { width: width - 10 });
    });

    if (doctor.chambers?.length) {
      doc.moveDown(0.25);
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor(PDF_COLORS.text)
        .text("Chambers", x + 10);

      doctor.chambers.forEach((chamber, chamberIndex) => {
        doc
          .font("Helvetica")
          .fontSize(12)
          .fillColor(PDF_COLORS.textSecondary)
          .text(`${chamberIndex + 1}. ${chamber.name || "Chamber"}`, x + 18);

        if (chamber.address) doc.text(`Address: ${chamber.address}`, x + 26);
        if (chamber.phone) doc.text(`Phone: ${chamber.phone}`, x + 26);
        if (chamber.serialNumber) doc.text(`Serial: ${chamber.serialNumber}`, x + 26);
        if (chamber.visitingDays?.length)
          doc.text(`Visiting Days: ${chamber.visitingDays.join(", ")}`, x + 26);
        if (chamber.visitingTime)
          doc.text(`Visiting Time: ${chamber.visitingTime}`, x + 26);
      });
    }

    if (doctor.contactInfo) {
      const contact = doctor.contactInfo;
      doc.moveDown(0.25);
      doc
        .font("Helvetica-Bold")
        .fontSize(12)
        .fillColor(PDF_COLORS.text)
        .text("Contact Information", x + 10);

      if (contact.phones?.length) {
        doc
          .font("Helvetica")
          .fontSize(12)
          .fillColor(PDF_COLORS.textSecondary)
          .text(`Phone: ${contact.phones.join(", ")}`, x + 18);
      }
      if (contact.emails?.length) {
        doc
          .font("Helvetica")
          .fontSize(12)
          .fillColor(PDF_COLORS.textSecondary)
          .text(`Email: ${contact.emails.join(", ")}`, x + 18);
      }
    }

    if (doctor.notes) {
      doc.moveDown(0.25);
      doc
        .font("Helvetica")
        .fontSize(12)
        .fillColor(PDF_COLORS.textSecondary)
        .text(`Notes: ${doctor.notes}`, x + 10, doc.y, { width: width - 10 });
    }

    doc.moveDown(0.6);

    if (index < doctors.length - 1) {
      doc
        .moveTo(x, doc.y)
        .lineTo(x + width, doc.y)
        .strokeColor(PDF_COLORS.border)
        .lineWidth(0.5)
        .stroke();

      doc.moveDown(0.6);
    }
  });
}