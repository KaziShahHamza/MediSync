// client/src/pages/Prescriptions.jsx

// Main page container connecting context, custom hook, and layout for prescriptions.

import { usePrescriptions } from "../context/PrescriptionContext";

import MedicalRecordPage from "../components/medical-record/MedicalRecordPage";

import useMedicalRecordPage from "../hooks/useMedicalRecordPage";

import { medicalRecordConfig } from "../utils/medicalRecord/medicalRecordConfig";

// Select prescription configuration settings
const config = medicalRecordConfig.prescription;

// Page view component for prescription management
export default function Prescriptions() {
  // Fetch prescriptions list and refresh method from context
  const { prescriptions, fetchPrescriptions } = usePrescriptions();

  // Initialize page handling state and handlers
  const page = useMedicalRecordPage({
    records: prescriptions,
    fetchRecords: fetchPrescriptions,
    config,
  });

  // Render unified medical records page layout
  return (
    <MedicalRecordPage
      config={config}
      records={prescriptions}
      title={page.title}
      file={page.file}
      selected={page.selected}
      loading={page.loading}
      uploadStatus={page.uploadStatus}
      zoom={page.zoom}
      onTitleChange={page.setTitle}
      onFileChange={page.handleFileChange}
      onUpload={page.handleUpload}
      onOpen={page.setSelected}
      onDelete={page.deleteRecord}
      onZoomIn={page.zoomIn}
      onZoomOut={page.zoomOut}
      onResetZoom={page.resetZoom}
      onClose={page.closeModal}
    />
  );
}
