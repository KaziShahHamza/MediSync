// client/src/pages/Prescriptions.jsx

// Connects prescription context data to the reusable medical record page.
// Handles prescription uploads, viewing, deletion, and record interactions.

import { usePrescriptions } from "../context/PrescriptionContext";

import MedicalRecordPage from "../components/medical-record/MedicalRecordPage";

import useMedicalRecordPage from "../hooks/useMedicalRecordPage";

import { medicalRecordConfig } from "../utils/medicalRecord/medicalRecordConfig";

const config = medicalRecordConfig.prescription;

// Provides the prescription management page.
export default function Prescriptions() {
  const { prescriptions, fetchPrescriptions } = usePrescriptions();

  const page = useMedicalRecordPage({
    records: prescriptions,
    fetchRecords: fetchPrescriptions,
    config,
  });

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
