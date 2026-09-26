// client/src/components/medicine/MedicineBasicInfo.jsx

// Renders core medicine identity, dosage, and image fields.
// Keeps basic medicine information separate from the main form state.

import { ImagePlus, Pill, X } from "lucide-react";

import { isStripMedicineType } from "../../data/medicine/medicineTypes";
import { DOSAGE_OPTIONS } from "../../data/medicine/dosageOptions";

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
  // Selects the preview image from the new upload or existing URL.
  const currentImage = imagePreview || imageUrl;

  return (
    <>
      {/* Displays the medicine name and type fields. */}
      <section className="grid grid-cols-1 gap-4 space-y-4 lg:grid-cols-2">
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

      {/* Displays dosage scheduling only for strip-based medicines. */}
      {isStripMedicineType(type) && (
        <section className="grid grid-cols-1 gap-4 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Dosage schedule
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Select when you take this medicine and enter the quantity for each
              time.
            </p>
          </div>

          {/* Renders selectable dosage times and their quantities. */}
          <div className="grid grid-cols-1 gap-3 space-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {DOSAGE_OPTIONS.map((option) => {
              const selected = dosage.find(
                (item) => item.time === option.value,
              );

              return (
                <div
                  key={option.value}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 p-3"
                >
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

      {/* Provides medicine image upload and preview controls. */}
      <section className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            Medicine image
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Add an optional photo of the medicine.
          </p>
        </div>

        {/* Shows the current image or the image upload area. */}
        {currentImage ? (
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

        {/* Allows replacing an existing medicine image. */}
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
