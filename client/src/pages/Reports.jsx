// client/src/pages/Reports.jsx

// Main page container connecting context, custom hook, and layout for reports.

import { useReports } from "../context/ReportContext";

import MedicalRecordPage from "../components/medical-record/MedicalRecordPage";

import useMedicalRecordPage from "../hooks/useMedicalRecordPage";

import { medicalRecordConfig } from "../utils/medicalRecord/medicalRecordConfig";

// Select report configuration settings
const config = medicalRecordConfig.report;

// Page view component for report management
export default function Reports() {
  // Fetch reports list and refresh method from context
  const { reports, fetchReports } = useReports();

  // Initialize page handling state and handlers
  const page = useMedicalRecordPage({
    records: reports,
    fetchRecords: fetchReports,
    config,
  });

  // Render unified medical records page layout
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
