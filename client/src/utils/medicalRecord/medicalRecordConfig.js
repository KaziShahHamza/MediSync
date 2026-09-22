// client/src/config/medicalRecordConfig.js

// Configuration parameters and string definitions for prescriptions and report pages.

// Configuration mapping for medical record page types
export const medicalRecordConfig = {
  // Config settings for prescription records
  prescription: {
    singular: "prescription",
    plural: "prescriptions",

    pageTitle: "My Prescriptions",
    pageDescription: "Store and manage your medical prescriptions securely.",

    uploadTitle: "Upload Prescriptions",
    uploadDescription: "Add a new prescription",

    titleLabel: "Prescription Title",
    titlePlaceholder: "Example: Dr. Rahman - 2023",

    imageLabel: "Prescription Image",
    imagePlaceholder: "Choose prescription image",

    emptyTitle: "No prescriptions yet",
    emptyDescription:
      "Upload your first prescription or medical report to keep your records organized.",

    uploadButton: "Upload Prescription",

    aiDescription:
      "After upload, MediSync will automatically generate a short AI summary of the document.",

    folder: "MediSync/prescriptions",

    apiPath: "/api/prescriptions",
  },

  // Config settings for laboratory report records
  report: {
    singular: "report",
    plural: "reports",

    pageTitle: "My Reports",
    pageDescription: "Store and manage your medical reports securely.",

    uploadTitle: "Upload Reports",
    uploadDescription: "Add a new medical report",

    titleLabel: "Report Title",
    titlePlaceholder: "Example: Blood Test - 2023",

    imageLabel: "Report Image",
    imagePlaceholder: "Choose report image",

    emptyTitle: "No reports yet",
    emptyDescription:
      "Upload your first medical report to keep your records organized.",

    uploadButton: "Upload Report",

    aiDescription:
      "After upload, MediSync will automatically generate a short AI summary of the report.",

    folder: "MediSync/reports",

    apiPath: "/api/reports",
  },
};
