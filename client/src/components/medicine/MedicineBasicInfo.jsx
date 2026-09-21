// client/src/components/medicine/MedicineBasicInfo.jsx

// Handles medicine name, type, dosage schedule, and medicine image fields.
// Keeps the basic medicine information UI separate from the main form logic.

import { ImagePlus, Pill, X } from "lucide-react";

import { isStripMedicineType } from "../../data/medicine/medicineTypes";

import { DOSAGE_OPTIONS } from "../../data/medicine/dosageOptions";

// Renders the basic information form fields for a medicine
export default function MedicineBasicInfo({
  name,
  setName,
  type,
  onTypeChange,
  dosage,
  onToggleDosageTime,
  onUpdateDosageQuantity,
  imageUrl,
  imagePreview,
  onImageChange,
  onRemoveImage,
}) {
  // Determine which image source to display for preview
  const currentImage = imagePreview || imageUrl;

  return (
    <>
      {/* Name and type input fields section */}
      <section className="space-y-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Medicine name input block */}
        <div>
          <label
            htmlFor="medicineName"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Medicine name
          </label>

          <input
            id="medicineName"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Napa"
            className="input w-full"
          />
        </div>

        {/* Medicine type select dropdown block */}
        <div>
          <label
            htmlFor="medicineType"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Medicine type
          </label>

          <select
            id="medicineType"
            value={type}
            onChange={(event) => onTypeChange(event.target.value)}
            className="input w-full"
          >
            <option value="tablet">Tablet</option>

            <option value="capsule">Capsule</option>

            <option value="syrup">Syrup</option>

            <option value="antibiotic">Antibiotic</option>

            <option value="injection">Injection</option>

            <option value="cream">Cream</option>

            <option value="ointment">Ointment</option>

            <option value="drops">Drops</option>

            <option value="inhaler">Inhaler</option>

            <option value="other">Other</option>
          </select>
        </div>
      </section>

      {/* Conditional dosage schedule selection for strip-based medicines */}
      {isStripMedicineType(type) && (
        <section className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Dosage schedule
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Select when you take this medicine and enter the quantity for each
              time.
            </p>
          </div>

          {/* Grid of dosage time checkboxes and quantity inputs */}
          <div className="space-y-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {DOSAGE_OPTIONS.map((option) => {
              // Check if the current dosage option is selected
              const selected = dosage.find(
                (item) => item.time === option.value,
              );

              return (
                <div
                  key={option.value}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"
                >
                  {/* Dosage time toggle label and checkbox */}
                  <label className="flex flex-1 cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={Boolean(selected)}
                      onChange={() => onToggleDosageTime(option.value)}
                      className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                    />

                    <span className="text-sm font-medium text-slate-800">
                      {option.label}
                    </span>
                  </label>

                  {/* Quantity input for selected dosage time */}
                  {selected && (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        step="1"
                        value={selected.quantity}
                        onChange={(event) =>
                          onUpdateDosageQuantity(
                            option.value,
                            event.target.value,
                          )
                        }
                        className="input w-10 text-center"
                        aria-label={`${option.label} dosage quantity`}
                      />

                      <span className="text-xs text-slate-500">piece</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Image upload and preview section */}
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Medicine image
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Add an optional photo of the medicine.
          </p>
        </div>

        {/* Render preview image or upload dropzone */}
        {currentImage ? (
          /* Active image display container with remove action */
          <div className="relative overflow-hidden rounded-xl border border-slate-200">
            <img
              src={currentImage}
              alt={name || "Medicine"}
              className="h-48 w-full bg-slate-50 object-contain"
            />

            <button
              type="button"
              onClick={onRemoveImage}
              className="absolute right-3 top-3 rounded-lg bg-white p-2 text-slate-500 shadow-sm transition hover:text-red-600"
              aria-label="Remove medicine image"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          /* File input dropzone when no image is present */
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center transition hover:border-sky-300 hover:bg-sky-50">
            <ImagePlus size={28} className="text-slate-400" />

            <span className="mt-2 text-sm font-medium text-slate-700">
              Add medicine image
            </span>

            <span className="mt-1 text-xs text-slate-500">
              JPG, PNG or other image up to 5MB
            </span>

            <input
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className="hidden"
            />
          </label>
        )}

        {/* Change image action button for modifying current photo */}
        {currentImage && (
          <label className="btn-secondary inline-flex cursor-pointer items-center gap-2">
            <ImagePlus size={17} />
            Change image
            <input
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className="hidden"
            />
          </label>
        )}
      </section>
    </>
  );
}
