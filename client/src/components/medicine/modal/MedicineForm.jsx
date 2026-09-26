// client/src/components/medicine/modal/MedicineForm.jsx

// Renders the medicine creation and editing form.
// Delegates form state, validation, image handling, and submission to useMedicineForm.

import MedicineBasicInfo from "../MedicineBasicInfo";
import MedicinePricing from "../MedicinePricing";
import MedicineTreatment from "../MedicineTreatment";

import useMedicineForm from "../../../hooks/useMedicineForm";

export default function MedicineForm({
  onSave,
  editing,
  onCancel,
  loading = false,
}) {
  // Connects form state and actions to the reusable medicine form hook.
  const {
    name,
    setName,
    type,
    handleTypeChange,
    dosage,
    toggleDosageTime,
    updateDosageQuantity,
    pricePerStrip,
    setPricePerStrip,
    piecesPerStrip,
    setPiecesPerStrip,
    pricePerUnit,
    setPricePerUnit,
    unitsPerMonth,
    setUnitsPerMonth,
    imageUrl,
    imagePreview,
    handleImageChange,
    removeImage,
    startMonth,
    setStartMonth,
    startYear,
    setStartYear,
    endMonth,
    setEndMonth,
    endYear,
    setEndYear,
    isActive,
    setIsActive,
    yearOptions,
    pricingType,
    error,
    handleSubmit,
  } = useMedicineForm({
    onSave,
    editing,
  });

  return (
    <form onSubmit={handleSubmit} className="card space-y-6">
      {/* Displays the form title and cancellation control. */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
            <span className="text-lg font-semibold">P</span>
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

        {/* Provides the secondary form cancellation action. */}
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          aria-label="Cancel editing"
        >
          <span className="text-lg">×</span>
        </button>
      </div>

      {/* Collects the medicine identity, dosage, and image information. */}
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

      {/* Handles pricing configuration according to the selected pricing type. */}
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

      {/* Handles the medicine treatment period and active status. */}
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

      {/* Displays validation or submission errors when present. */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Provides final cancellation and submission actions. */}
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
