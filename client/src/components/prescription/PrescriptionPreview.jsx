// src/components/prescription/PrescriptionPreview.jsx

import { useEffect, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  RotateCcw,
  Sparkles,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

function PrescriptionPreview({ prescription, onClose }) {
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const zoomIn = () => {
    setZoom((current) => Math.min(3, current + 0.25));
  };

  const zoomOut = () => {
    setZoom((current) => Math.max(0.5, current - 0.25));
  };

  const resetZoom = () => {
    setZoom(1);
  };

  const createdDate = prescription.createdAt
    ? new Date(prescription.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown date";

  return (
    <div
      className="ms-modal-backdrop ms-prescription-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="ms-modal ms-prescription-preview-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="prescription-preview-title"
      >
        <header className="ms-modal-header">
          <div className="ms-prescription-modal-heading">
            <h2 id="prescription-preview-title" className="ms-modal-title">
              {prescription.title}
            </h2>

            <div className="ms-modal-meta">
              <CalendarDays size={15} strokeWidth={1.8} />
              <span>{createdDate}</span>
            </div>
          </div>

          <button
            type="button"
            className="ms-icon-button"
            onClick={onClose}
            aria-label="Close prescription preview"
            title="Close"
          >
            <X size={20} strokeWidth={1.8} />
          </button>
        </header>

        <div className="ms-prescription-preview-toolbar">
          <span className="ms-prescription-zoom-value">
            {Math.round(zoom * 100)}%
          </span>

          <div className="ms-prescription-zoom-controls">
            <button
              type="button"
              className="ms-icon-button"
              onClick={zoomOut}
              disabled={zoom <= 0.5}
              aria-label="Zoom out"
              title="Zoom out"
            >
              <ZoomOut size={17} />
            </button>

            <button
              type="button"
              className="ms-icon-button"
              onClick={resetZoom}
              aria-label="Reset zoom"
              title="Reset zoom"
            >
              <RotateCcw size={16} />
            </button>

            <button
              type="button"
              className="ms-icon-button"
              onClick={zoomIn}
              disabled={zoom >= 3}
              aria-label="Zoom in"
              title="Zoom in"
            >
              <ZoomIn size={17} />
            </button>
          </div>
        </div>

        <div className="ms-prescription-preview-layout">
          <div className="ms-prescription-image-panel">
            <div className="ms-prescription-image-scroll">
              <img
                className="ms-prescription-image"
                src={prescription.imageUrl}
                alt={prescription.title}
                style={{
                  width: `${zoom * 100}%`,
                }}
              />
            </div>
          </div>

          <aside className="ms-prescription-ai-panel">
            <div className="ms-prescription-ai-header">
              <div className="ms-prescription-ai-icon">
                <Sparkles size={19} strokeWidth={1.8} />
              </div>

              <div>
                <h3>AI summary</h3>
                <p>Generated from this prescription image</p>
              </div>
            </div>

            {prescription.aiSummary ? (
              <div className="ms-prescription-ai-summary">
                {prescription.aiSummary}
              </div>
            ) : (
              <div className="ms-prescription-ai-warning">
                <AlertCircle size={19} strokeWidth={1.8} />

                <div>
                  <strong>Summary unavailable</strong>

                  <p>
                    An AI summary has not been generated for this prescription
                    yet.
                  </p>
                </div>
              </div>
            )}

            <div className="ms-prescription-ai-disclaimer">
              <strong>Important</strong>

              <p>
                AI-generated information may contain errors. Always verify
                prescription details with your doctor or pharmacist.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default PrescriptionPreview;
