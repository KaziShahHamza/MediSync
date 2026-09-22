// client/src/components/medical-records/MedicalRecordPage.jsx

// Layout component rendering the records gallery, upload panel, and detail viewer modal.

import { FileImage } from "lucide-react";

import MedicalRecordUpload from "./MedicalRecordUpload";
import MedicalRecordCard from "./MedicalRecordCard";
import MedicalRecordModal from "./MedicalRecordModal";

// Main UI page view for listing and managing medical documents
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
  return (
    <div className="container py-10">
      {/* Page Header section */}
      <div className="mb-10">
        <h1 className="page-title">{config.pageTitle}</h1>

        <p className="subtitle mt-2">{config.pageDescription}</p>
      </div>

      {/* Main grid wrapper splitting gallery list and upload section */}
      <div className="grid lg:grid-cols-[1.7fr_0.8fr] gap-8 items-start">
        {/* Document gallery list area */}
        <section>
          {/* Header indicator showing total record count */}
          <div className="flex justify-between items-center mb-5">
            <p className="text-sm text-slate-500 mt-1">
              {records.length} record
              {records.length !== 1 && "s"}
            </p>
          </div>

          {/* Conditional rendering of cards grid vs empty view */}
          {records.length ? (
            // Cards grid view
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
            // Empty state placeholder banner
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

        {/* Floating document upload form */}
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

      {/* Full screen medical document detail modal */}
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
