// server/services/pdfService.js

// Generates the MediSync health report as a PDF document.
// Renders personal information, health data, medicines, doctors, and records.

import PDFDocument from "pdfkit";

import {
  calculateAge,
  formatDate,
  formatValue,
  getImageBuffer,
} from "../utils/pdf/pdfHelpers.js";

// Generates the complete health report PDF and streams it to the response.
export async function generateHealthReport(res, data) {
  const doc = new PDFDocument({
    margin: 50,
    size: "A4",
  });

  // Handle PDF generation errors before output completes.
  doc.on("error", (error) => {
    console.error("PDF generation error:", error);

    if (!res.headersSent) {
      res.status(500).json({
        message: "Failed to generate PDF.",
      });
    }
  });

  // Formats the generation timestamp displayed in the report.
  function formatExportDateTime(date = new Date()) {
    const day = date.getDate();

    const month = date.toLocaleString("en-US", {
      month: "long",
    });

    const year = date.getFullYear();

    const time = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    return `${day} ${month}, ${year} at ${time}`;
  }

  // Connect the PDF document to the HTTP response stream.
  doc.pipe(res);

  const { user, profile, health, medicines, doctors, prescriptions, aiReport } =
    data;

  // Render the report header.
  doc.fontSize(24).fillColor("#2563eb").text("MediSync Health Report");

  doc
    .moveDown(0.5)
    .fontSize(10)
    .fillColor("#64748b")
    .text(`PDF generated on ${formatExportDateTime()}.`);

  doc.moveDown(2);

  // Render personal information.
  doc.fontSize(16).fillColor("#0f172a").text("Personal Information");

  doc.moveDown(0.7);

  doc.fontSize(11).fillColor("#334155");

  doc.text(`Name: ${formatValue(user?.name)}`);
  doc.text(`Email: ${formatValue(user?.email)}`);

  if (profile) {
    const age = calculateAge(profile.dob);

    if (age !== null) {
      doc.text(`Age: ${age} years`);
    }

    doc.text(`Gender: ${formatValue(profile.gender)}`);

    const feet = profile.height?.feet;
    const inches = profile.height?.inches;

    if (feet !== null && feet !== undefined) {
      doc.text(`Height: ${feet} ft ${inches || 0} in`);
    }

    doc.text(`Blood Group: ${formatValue(profile.bloodGroup)}`);
  }

  doc.moveDown(1.5);

  // Render the latest AI-generated health summary.
  doc
    .fontSize(16)
    .fillColor("#0f172a")
    .text("Latest Health Summary (AI Generated)");

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

  // Render the latest health records.
  doc.fontSize(16).fillColor("#0f172a").text("Latest Health Records");

  doc.moveDown(0.7);

  doc.fontSize(11).fillColor("#334155");

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

  doc.font("Helvetica-Bold").text("Blood Sugar");

  doc.font("Helvetica");

  const diabetes = health.diabetes;

  if (diabetes?.fasting || diabetes?.postMeal || diabetes?.random) {
    if (diabetes.fasting) {
      doc.text(`Fasting: ${diabetes.fasting.glucose} mg/dL`);

      doc
        .fontSize(9)
        .fillColor("#64748b")
        .text(`Recorded: ${formatDate(diabetes.fasting.date)}`);

      doc.fontSize(11).fillColor("#334155");
    }

    if (diabetes.postMeal) {
      doc.text(`2 Hours After Meal: ${diabetes.postMeal.glucose} mg/dL`);

      doc
        .fontSize(9)
        .fillColor("#64748b")
        .text(`Recorded: ${formatDate(diabetes.postMeal.date)}`);

      doc.fontSize(11).fillColor("#334155");
    }

    if (diabetes.random) {
      doc.text(`Random: ${diabetes.random.glucose} mg/dL`);

      doc
        .fontSize(9)
        .fillColor("#64748b")
        .text(`Recorded: ${formatDate(diabetes.random.date)}`);

      doc.fontSize(11).fillColor("#334155");
    }
  } else {
    doc.text("No blood sugar record available.");
  }

  doc.moveDown();

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

  // Render all currently active medicines.
  doc.fontSize(16).fillColor("#0f172a").text("Active Medicines");

  doc.moveDown(0.7);

  if (medicines.length > 0) {
    medicines.forEach((medicine, index) => {
      const schedule =
        medicine.dosageTimes?.length > 0
          ? medicine.dosageTimes.join(", ")
          : "No schedule";

      const startMonth = medicine.startDate
        ? new Date(medicine.startDate).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })
        : "Unknown";

      doc
        .fontSize(11)
        .fillColor("#334155")
        .text(`${index + 1}. ${medicine.name} — ${schedule}`);

      doc.fontSize(9).fillColor("#64748b").text(`   ${startMonth} – Present`);

      doc.moveDown(0.5);
    });
  } else {
    doc.fontSize(11).fillColor("#64748b").text("No active medicines recorded.");
  }

  doc.moveDown(1.5);

  // Render the user's doctors and chamber information.
  doc.fontSize(16).fillColor("#0f172a").text("Doctors");

  doc.moveDown(0.7);

  if (doctors.length > 0) {
    doctors.forEach((doctor, index) => {
      doc
        .fontSize(11)
        .fillColor("#334155")
        .text(`${index + 1}. ${doctor.name || "Unnamed Doctor"}`);

      if (doctor.bmdcRegNo) {
        doc.text(`   BMDC Reg. No: ${doctor.bmdcRegNo}`);
      }

      if (doctor.designation) {
        doc.text(`   Designation: ${doctor.designation}`);
      }

      if (doctor.degrees?.length > 0) {
        doc.text(`   Degrees: ${doctor.degrees.join(", ")}`);
      }

      if (doctor.specialities?.length > 0) {
        doc.text(`   Specialities: ${doctor.specialities.join(", ")}`);
      }

      if (doctor.primaryHospital) {
        doc.text(`   Primary Hospital: ${doctor.primaryHospital}`);
      }

      if (doctor.chambers?.length > 0) {
        doc.moveDown(0.2);

        doc.fontSize(10).fillColor("#475569").text("   Chambers:");

        doctor.chambers.forEach((chamber, chamberIndex) => {
          doc
            .fontSize(10)
            .fillColor("#475569")
            .text(`      ${chamberIndex + 1}. ${chamber.name || "Chamber"}`);

          if (chamber.address) {
            doc.text(`         Address: ${chamber.address}`);
          }

          if (chamber.phone) {
            doc.text(`         Phone: ${chamber.phone}`);
          }

          if (chamber.serialNumber) {
            doc.text(`         Serial: ${chamber.serialNumber}`);
          }

          if (chamber.visitingDays?.length > 0) {
            doc.text(
              `         Visiting Days: ${chamber.visitingDays.join(", ")}`,
            );
          }

          if (
            chamber.visitingTime?.startHour &&
            chamber.visitingTime?.startPeriod &&
            chamber.visitingTime?.endHour &&
            chamber.visitingTime?.endPeriod
          ) {
            doc.text(
              `         Visiting Time: ${chamber.visitingTime.startHour} ${chamber.visitingTime.startPeriod} to ${chamber.visitingTime.endHour} ${chamber.visitingTime.endPeriod}`,
            );
          }
        });
      }

      if (doctor.contactInfo) {
        const contact = doctor.contactInfo;

        doc.moveDown(0.2);

        doc.fontSize(10).fillColor("#475569").text("   Contact Information:");

        if (contact.phones?.length > 0) {
          doc.text(`      Phone: ${contact.phones.join(", ")}`);
        }

        if (contact.emails?.length > 0) {
          doc.text(`      Email: ${contact.emails.join(", ")}`);
        }

        if (contact.website) {
          doc.text(`      Website: ${contact.website}`);
        }

        if (contact.facebook) {
          doc.text(`      Facebook: ${contact.facebook}`);
        }

        if (contact.linkedin) {
          doc.text(`      LinkedIn: ${contact.linkedin}`);
        }
      }

      if (doctor.notes) {
        doc.moveDown(0.2);
        doc.text(`   Notes: ${doctor.notes}`);
      }

      doc.moveDown(0.6);
    });
  } else {
    doc.fontSize(11).fillColor("#64748b").text("No doctors recorded.");
  }

  // Render prescription images and AI summaries.
  if (prescriptions?.length > 0) {
    for (let index = 0; index < prescriptions.length; index++) {
      const prescription = prescriptions[index];

      // Each prescription starts on a separate page.
      doc.addPage();

      doc
        .fontSize(18)
        .fillColor("#0f172a")
        .text(`Medical Record ${index + 1}`);

      doc.moveDown(0.5);

      doc.fontSize(13).fillColor("#334155").text(prescription.title);

      doc.moveDown(1);

      if (prescription.aiSummary) {
        doc.fontSize(10).fillColor("#334155").text(prescription.aiSummary, {
          align: "left",
          lineGap: 3,
        });

        if (prescription.aiAnalyzedAt) {
          doc.moveDown(0.4);
        }
      } else {
        doc
          .fontSize(10)
          .fillColor("#64748b")
          .text("No AI summary is available for this medical record.");
      }

      doc.moveDown(1);

      // Download and insert the prescription image.
      const imageBuffer = await getImageBuffer(prescription.imageUrl);

      if (imageBuffer) {
        try {
          const maxWidth = 495;
          const remainingHeight = doc.page.height - doc.y - 70;

          const maxHeight = Math.min(remainingHeight, 430);

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

  // Add the report disclaimer footer page.
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

  // Finalize and close the PDF stream.
  doc.end();
}
