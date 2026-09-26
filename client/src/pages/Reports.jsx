// client/src/pages/Reports.jsx

// Connects report context data with the reusable medical record page.
// Provides report-specific configuration and page interaction handlers.

import { useReports } from "../context/ReportContext";

import MedicalRecordPage from "../components/medical-record/MedicalRecordPage";

import useMedicalRecordPage from "../hooks/useMedicalRecordPage";

import { medicalRecordConfig } from "../utils/medicalRecord/medicalRecordConfig";

const config = medicalRecordConfig.report;

export default function Reports() {
  // Load report records and the refresh function from context.
  const { reports, fetchReports } = useReports();

  // Initialize shared medical record page state and handlers.
  const page = useMedicalRecordPage({
    records: reports,
    fetchRecords: fetchReports,
    config,
  });

  // Render the reusable medical record interface.
  return (
    <MedicalRecordPage
      config={config}
      records={reports}
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
