// client/src/components/medicine/MedicineForm.jsx

// Manages medicine creation/editing state and submits normalized medicine data.
// Handles form initialization, validation, dosage, pricing, treatment, and submission.

import { useEffect, useMemo, useState } from "react";

import { Pill, X } from "lucide-react";

import MedicineBasicInfo from "../MedicineBasicInfo";
import MedicinePricing from "../MedicinePricing";
import MedicineTreatment from "../MedicineTreatment";

import { isStripMedicineType } from "../../../data/medicine/medicineTypes";

import {
  createDateFromParts,
  getDateParts,
  getPricingTypeForType,
  getYearOptions,
  normalizeDosage,
} from "../../../utils/medicine/medicineHelpers";

import { validateMedicineForm } from "../../../utils/medicine/medicineValidation";

// Renders the wrapper form for creating or updating medicine records
export default function MedicineForm({
  onSave,
  editing,
  onCancel,
  loading = false,
}) {
  // Define form state values
  const [name, setName] = useState("");
  const [type, setType] = useState("tablet");

  const [dosage, setDosage] = useState([]);

  const [pricePerStrip, setPricePerStrip] = useState("");

  const [piecesPerStrip, setPiecesPerStrip] = useState("");

  const [pricePerUnit, setPricePerUnit] = useState("");

  const [unitsPerMonth, setUnitsPerMonth] = useState("");

  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [startMonth, setStartMonth] = useState("");

  const [startYear, setStartYear] = useState(new Date().getFullYear());

  const [endMonth, setEndMonth] = useState("");

  const [endYear, setEndYear] = useState("");

  const [isActive, setIsActive] = useState(true);

  const [error, setError] = useState("");

  // Memoize pricing classification based on medicine type selection
  const pricingType = useMemo(() => getPricingTypeForType(type), [type]);

  // Memoize available list of years for select dropdowns
  const yearOptions = useMemo(() => getYearOptions(), []);

  // Sync state when entering edit mode or resetting when clearing edit state
  useEffect(() => {
    if (!editing) {
      resetForm();
      return;
    }

    // Extract date breakdown from existing medicine record
    const start = getDateParts(editing.startDate);

    const end = getDateParts(editing.endDate);

    const editingPricingType = getPricingTypeForType(editing.type);

    setName(editing.name || "");

    setType(editing.type || "tablet");

    setDosage(
      editingPricingType === "strip" ? normalizeDosage(editing.dosage) : [],
    );

    setPricePerStrip(editing.pricePerStrip ?? "");

    setPiecesPerStrip(editing.piecesPerStrip ?? "");

    setPricePerUnit(editing.pricePerUnit ?? "");

    setUnitsPerMonth(editing.unitsPerMonth ?? "");

    setImageUrl(editing.imageUrl || "");

    setImageFile(null);
    setImagePreview("");

    setStartMonth(start.month === "" ? "" : String(start.month));

    setStartYear(start.year || new Date().getFullYear());

    setEndMonth(end.month === "" ? "" : String(end.month));

    setEndYear(end.year === "" ? "" : String(end.year));

    setIsActive(editing.isActive !== false);

    setError("");
  }, [editing]);

  // Create temporary preview URL when a new image file is selected
  useEffect(() => {
    if (!imageFile) {
      setImagePreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);

    setImagePreview(objectUrl);

    // Clean up memory leak by revoking object URL on unmount/change
    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageFile]);

  // Resets all form fields to default state values
  function resetForm() {
    setName("");
    setType("tablet");
    setDosage([]);

    setPricePerStrip("");
    setPiecesPerStrip("");

    setPricePerUnit("");
    setUnitsPerMonth("");

    setImageUrl("");
    setImageFile(null);
    setImagePreview("");

    setStartMonth("");

    setStartYear(new Date().getFullYear());

    setEndMonth("");
    setEndYear("");

    setIsActive(true);
    setError("");
  }

  // Handles type changes and clears irrelevant pricing/dosage fields
  function handleTypeChange(newType) {
    setType(newType);

    const newPricingType = getPricingTypeForType(newType);

    // Clear non-applicable fields when switching between strip and unit pricing
    if (newPricingType === "strip") {
      setPricePerUnit("");
      setUnitsPerMonth("");
    } else {
      setDosage([]);
      setPricePerStrip("");
      setPiecesPerStrip("");
    }

    setError("");
  }

  // Toggles dosage timing slots on or off
  function toggleDosageTime(time) {
    setDosage((current) => {
      const exists = current.some((item) => item.time === time);

      if (exists) {
        return current.filter((item) => item.time !== time);
      }

      return [
        ...current,
        {
          time,
          quantity: 1,
        },
      ];
    });
  }

  // Updates the dosage unit count for a given timing option
  function updateDosageQuantity(time, value) {
    setDosage((current) =>
      current.map((item) =>
        item.time === time
          ? {
              ...item,
              quantity: value,
            }
          : item,
      ),
    );
  }

  // Validates file format and size for image upload
  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // Check for valid image MIME type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");

      event.target.value = "";

      return;
    }

    // Enforce 5MB size limit
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be 5MB or less.");

      event.target.value = "";

      return;
    }

    setImageFile(file);
    setImageUrl("");
    setError("");

    event.target.value = "";
  }

  // Removes currently selected image file and preview state
  function removeImage() {
    setImageFile(null);
    setImagePreview("");
    setImageUrl("");
  }

  // Validates, formats, and submits medicine form payload
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    // Validate inputs against defined form rules
    const validationError = validateMedicineForm({
      name,
      type,
      dosage,
      pricePerStrip,
      piecesPerStrip,
      pricePerUnit,
      unitsPerMonth,
      startMonth,
      startYear,
      endMonth,
      endYear,
      isActive,
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    // Construct unified Date objects from form dropdown selections
    const startDate = createDateFromParts(startMonth, startYear);

    const endDate = isActive ? null : createDateFromParts(endMonth, endYear);

    const normalizedDosage = normalizeDosage(dosage);

    // Build finalized submission payload object
    const medicineData = {
      name: name.trim(),
      type,
      pricingType,

      dosage: isStripMedicineType(type) ? normalizedDosage : [],

      pricePerStrip: isStripMedicineType(type) ? Number(pricePerStrip) : null,

      piecesPerStrip: isStripMedicineType(type) ? Number(piecesPerStrip) : null,

      pricePerUnit: !isStripMedicineType(type) ? Number(pricePerUnit) : null,

      unitsPerMonth: !isStripMedicineType(type) ? Number(unitsPerMonth) : null,

      imageUrl,
      imageFile,

      startDate,
      endDate,

      isActive,
    };

    try {
      await onSave(medicineData);

      resetForm();
    } catch (submitError) {
      setError(submitError?.message || "Failed to save medicine.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-6">
      {/* Form modal/card header section */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <Pill size={20} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {editing ? "Edit Medicine" : "Add Medicine"}
            </h2>

            <p className="text-sm text-slate-500">
              {editing
                ? "Update your medicine information."
                : "Add a medicine to your treatment list."}
            </p>
          </div>
        </div>

        {/* Form cancel/close button */}
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label="Cancel editing"
        >
          <X size={20} />
        </button>
      </div>

      {/* Basic medicine info step component */}
      <MedicineBasicInfo
        name={name}
        setName={setName}
        type={type}
        onTypeChange={handleTypeChange}
        dosage={dosage}
        onToggleDosageTime={toggleDosageTime}
        onUpdateDosageQuantity={updateDosageQuantity}
        imageUrl={imageUrl}
        imagePreview={imagePreview}
        onImageChange={handleImageChange}
        onRemoveImage={removeImage}
      />

      {/* Pricing configuration step component */}
      <MedicinePricing
        pricingType={pricingType}
        pricePerStrip={pricePerStrip}
        setPricePerStrip={setPricePerStrip}
        piecesPerStrip={piecesPerStrip}
        setPiecesPerStrip={setPiecesPerStrip}
        pricePerUnit={pricePerUnit}
        setPricePerUnit={setPricePerUnit}
        unitsPerMonth={unitsPerMonth}
        setUnitsPerMonth={setUnitsPerMonth}
        dosage={dosage}
      />

      {/* Treatment timeline step component */}
      <MedicineTreatment
        startMonth={startMonth}
        setStartMonth={setStartMonth}
        startYear={startYear}
        setStartYear={setStartYear}
        endMonth={endMonth}
        setEndMonth={setEndMonth}
        endYear={endYear}
        setEndYear={setEndYear}
        isActive={isActive}
        setIsActive={setIsActive}
        yearOptions={yearOptions}
      />

      {/* Validation error notification alert */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Form submit and cancel button group */}
      <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="btn-secondary"
        >
          Cancel
        </button>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? "Saving..." : editing ? "Update Medicine" : "Add Medicine"}
        </button>
      </div>
    </form>
  );
}
