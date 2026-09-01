// server/services/pdfService.js

import PDFDocument from "pdfkit";
import axios from "axios";

function formatDate(date) {
  if (!date) return "Not available";

  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatValue(value, fallback = "Not available") {
  return value !== null && value !== undefined && value !== ""
    ? value
    : fallback;
}

// Download image from Cloudinary
async function getImageBuffer(imageUrl) {
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

export async function generateHealthReport(res, data) {
  const doc = new PDFDocument({
    margin: 50,
    size: "A4",
  });

  doc.pipe(res);

  const { user, profile, health, medicines, doctors, prescriptions, aiReport } =
    data;

  // ==============================
  // HEADER
  // ==============================

  doc.fontSize(24).fillColor("#2563eb").text("MediSync Health Report");

  doc
    .moveDown(0.5)
    .fontSize(10)
    .fillColor("#64748b")
    .text(`Generated on ${new Date().toLocaleString()}`);

  doc.moveDown(2);

  // ==============================
  // PERSONAL INFORMATION
  // ==============================

  doc.fontSize(16).fillColor("#0f172a").text("Personal Information");

  doc.moveDown(0.7);

  doc.fontSize(11).fillColor("#334155");

  doc.text(`Name: ${formatValue(user?.name)}`);
  doc.text(`Email: ${formatValue(user?.email)}`);

  if (profile) {
    doc.text(`Date of Birth: ${formatDate(profile.dob)}`);

    doc.text(`Gender: ${formatValue(profile.gender)}`);

    const feet = profile.height?.feet;
    const inches = profile.height?.inches;

    if (feet !== null && feet !== undefined) {
      doc.text(`Height: ${feet} ft ${inches || 0} in`);
    }

    doc.text(`Blood Group: ${formatValue(profile.bloodGroup)}`);
  }

  doc.moveDown(1.5);

  // ==============================
  // AI SUMMARY
  // ==============================

  doc.fontSize(16).fillColor("#0f172a").text("AI Health Summary");

  doc.moveDown(0.7);

  doc.fontSize(11).fillColor("#334155");

  if (aiReport?.summary) {
    doc.text(aiReport.summary, {
      align: "left",
      lineGap: 4,
    });

    doc.moveDown(0.5);

    doc
      .fontSize(9)
      .fillColor("#64748b")
      .text(`AI summary generated: ${formatDate(aiReport.generatedAt)}`);
  } else {
    doc
      .fontSize(11)
      .fillColor("#64748b")
      .text("No AI health summary has been generated yet.");
  }

  doc.moveDown(1.5);

  // ==============================
  // LATEST HEALTH RECORDS
  // ==============================

  doc.fontSize(16).fillColor("#0f172a").text("Latest Health Records");

  doc.moveDown(0.7);

  doc.fontSize(11).fillColor("#334155");

  // Blood Pressure

  doc.font("Helvetica-Bold").text("Blood Pressure");

  doc.font("Helvetica");

  if (health.bloodPressure) {
    doc.text(`${health.bloodPressure.high}/${health.bloodPressure.low} mmHg`);

    doc
      .fontSize(9)
      .fillColor("#64748b")
      .text(`Recorded: ${formatDate(health.bloodPressure.date)}`);

    doc.fontSize(11).fillColor("#334155");
  } else {
    doc.text("No blood pressure record available.");
  }

  doc.moveDown();

  // Blood Sugar

  doc.font("Helvetica-Bold").text("Blood Sugar");

  doc.font("Helvetica");

  if (health.diabetes) {
    doc.text(`${health.diabetes.glucose} mmol/L`);

    doc
      .fontSize(9)
      .fillColor("#64748b")
      .text(`Recorded: ${formatDate(health.diabetes.date)}`);

    doc.fontSize(11).fillColor("#334155");
  } else {
    doc.text("No blood sugar record available.");
  }

  doc.moveDown();

  // Weight

  doc.font("Helvetica-Bold").text("Latest Weight");

  doc.font("Helvetica");

  if (health.weight) {
    doc.text(`${health.weight.value} kg`);

    doc
      .fontSize(9)
      .fillColor("#64748b")
      .text(`Recorded: ${formatDate(health.weight.date)}`);

    doc.fontSize(11).fillColor("#334155");
  } else {
    doc.text("No weight record available.");
  }

  doc.moveDown();

  // BMI

  doc.font("Helvetica-Bold").text("BMI");

  doc.font("Helvetica");

  if (health.bmi) {
    doc.text(`${health.bmi.value} (${health.bmi.category})`);

    if (health.bmi.date) {
      doc
        .fontSize(9)
        .fillColor("#64748b")
        .text(`Based on weight recorded: ${formatDate(health.bmi.date)}`);

      doc.fontSize(11).fillColor("#334155");
    }
  } else {
    doc.text("BMI cannot be calculated yet.");
  }

  doc.moveDown(1.5);

  // ==============================
  // MEDICINES
  // ==============================

  doc.fontSize(16).fillColor("#0f172a").text("Medicines");

  doc.moveDown(0.7);

  if (medicines.length > 0) {
    medicines.forEach((medicine, index) => {
      const schedule =
        medicine.dosageTimes?.length > 0
          ? medicine.dosageTimes.join(", ")
          : "No schedule";

      doc
        .fontSize(11)
        .fillColor("#334155")
        .text(`${index + 1}. ${medicine.name} — ${schedule}`);
    });
  } else {
    doc.fontSize(11).fillColor("#64748b").text("No medicines recorded.");
  }

  doc.moveDown(1.5);

  // ==============================
  // DOCTORS
  // ==============================

  doc.fontSize(16).fillColor("#0f172a").text("Healthcare Providers");

  doc.moveDown(0.7);

  if (doctors.length > 0) {
    doctors.forEach((doctor, index) => {
      doc
        .fontSize(11)
        .fillColor("#334155")
        .text(`${index + 1}. ${doctor.name}`);

      if (doctor.specialty) {
        doc.text(`   Specialty: ${doctor.specialty}`);
      }

      if (doctor.hospital) {
        doc.text(`   Hospital: ${doctor.hospital}`);
      }

      if (doctor.phone) {
        doc.text(`   Phone: ${doctor.phone}`);
      }

      doc.moveDown(0.5);
    });
  } else {
    doc.fontSize(11).fillColor("#64748b").text("No doctors recorded.");
  }

  // ==============================
  // PRESCRIPTIONS / REPORT IMAGES
  // ==============================

  if (prescriptions?.length > 0) {
    for (let index = 0; index < prescriptions.length; index++) {
      const prescription = prescriptions[index];

      // Each prescription gets its own page
      doc.addPage();

      doc
        .fontSize(18)
        .fillColor("#0f172a")
        .text(`Medical Record ${index + 1}`);

      doc.moveDown(0.5);

      doc.fontSize(12).fillColor("#334155").text(prescription.title);

      doc
        .moveDown(0.3)
        .fontSize(9)
        .fillColor("#64748b")
        .text(`Uploaded: ${formatDate(prescription.createdAt)}`);

      doc.moveDown(1);

      const imageBuffer = await getImageBuffer(prescription.imageUrl);

      if (imageBuffer) {
        try {
          // A4 page size ≈ 595 x 842 points
          // With margins we have roughly:
          // Width = 495
          // Height = 650

          const maxWidth = 495;
          const maxHeight = 650;

          const x = 50;
          const y = doc.y;

          doc.image(imageBuffer, x, y, {
            fit: [maxWidth, maxHeight],
            align: "center",
            valign: "center",
          });
        } catch (error) {
          console.error("Failed to insert prescription image:", error);

          doc
            .fontSize(11)
            .fillColor("#dc2626")
            .text("Unable to display this medical record image.");
        }
      } else {
        doc
          .fontSize(11)
          .fillColor("#dc2626")
          .text("Unable to download this medical record image.");
      }
    }
  }

  // ==============================
  // FOOTER
  // ==============================

  doc.addPage();

  doc
    .fontSize(9)
    .fillColor("#94a3b8")
    .text(
      "This report is generated from information stored in MediSync and is not a substitute for professional medical advice.",
      {
        align: "center",
      },
    );

  doc.end();
}
