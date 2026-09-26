// client/src/components/medical-records/MedicalRecordPage.jsx

// Provides the main medical record gallery and upload layout.
// Connects record cards, upload controls, and the detail modal.

import { FileImage } from "lucide-react";

import MedicalRecordCard from "./MedicalRecordCard";
import MedicalRecordModal from "./MedicalRecordModal";
import MedicalRecordUpload from "./MedicalRecordUpload";

// Renders the medical record page and coordinates its child components.
export default function MedicalRecordPage({
  config,
  records,
  title,
  file,
  selected,
  loading,
  uploadStatus,
  zoom,
  onTitleChange,
  onFileChange,
  onUpload,
  onOpen,
  onDelete,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onClose,
}) {
  // Determines whether the gallery should show records or an empty state.
  const hasRecords = records.length > 0;

  return (
    <div className="container py-10">
      <div className="mb-10">
        <h1 className="page-title">{config.pageTitle}</h1>

        <p className="subtitle mt-2">{config.pageDescription}</p>
      </div>

      {/* Organizes the record gallery beside the upload form. */}
      <div className="grid lg:grid-cols-[1.7fr_0.8fr] gap-8 items-start">
        <section>
          <div className="flex justify-between items-center mb-5">
            <p className="text-sm text-slate-500 mt-1">
              {records.length} record
              {records.length !== 1 && "s"}
            </p>
          </div>

          {/* Renders existing records or the configured empty state. */}
          {hasRecords ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {records.map((record) => (
                <MedicalRecordCard
                  key={record._id}
                  record={record}
                  onOpen={onOpen}
                  onDelete={onDelete}
                />
              ))}
            </div>
          ) : (
            <div className="card flex flex-col items-center justify-center py-16 text-center">
              <FileImage size={48} className="text-slate-400" />

              <h3 className="mt-4 text-lg font-semibold text-slate-800">
                {config.emptyTitle}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {config.emptyDescription}
              </p>
            </div>
          )}
        </section>

        <MedicalRecordUpload
          config={config}
          title={title}
          file={file}
          loading={loading}
          uploadStatus={uploadStatus}
          onTitleChange={onTitleChange}
          onFileChange={onFileChange}
          onUpload={onUpload}
        />
      </div>

      {/* Opens the selected record in the detailed image viewer. */}
      <MedicalRecordModal
        record={selected}
        zoom={zoom}
        config={config}
        onZoomIn={onZoomIn}
        onZoomOut={onZoomOut}
        onResetZoom={onResetZoom}
        onClose={onClose}
      />
    </div>
  );
}
