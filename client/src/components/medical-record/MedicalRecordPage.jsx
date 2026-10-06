// client/src/components/medical-record/MedicalRecordPage.jsx

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
  limitReached,
  maxRecords,
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

      <div className="grid items-start gap-8 lg:grid-cols-[1.7fr_0.8fr]">
        <section>
          <div className="mb-5 flex items-center justify-between">
            <p className="mt-1 text-sm text-slate-500">
              {records.length}
              {maxRecords ? ` / ${maxRecords}` : ""} record
              {records.length !== 1 && "s"}
            </p>

            {limitReached && (
              <p className="text-sm font-medium text-slate-500">
                Maximum reached
              </p>
            )}
          </div>

          {hasRecords ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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
          disabled={limitReached}
          onTitleChange={onTitleChange}
          onFileChange={onFileChange}
          onUpload={onUpload}
        />
      </div>

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
