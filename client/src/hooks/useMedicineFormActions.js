// client/src/hooks/useMedicineFormActions.js

// Handles medicine field updates, resets, dosage changes, and image selection.
// Keeps reusable form actions separate from medicine initialization and submission.

import { getPricingTypeForType } from "../utils/medicine/medicineHelpers";

export default function useMedicineFormActions({
  setName,
  setType,
  setDosage,
  setPricePerStrip,
  setPiecesPerStrip,
  setPricePerUnit,
  setUnitsPerMonth,
  setImageUrl,
  setImageFile,
  setImagePreview,
  setStartMonth,
  setStartYear,
  setEndMonth,
  setEndYear,
  setIsActive,
  setError,
}) {
  // Reset all medicine fields to their initial values.
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

  // Change medicine type and clear incompatible pricing fields.
  function handleTypeChange(newType) {
    setType(newType);

    const newPricingType = getPricingTypeForType(newType);

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

  // Toggle a dosage time in the medicine schedule.
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

  // Update the quantity assigned to a dosage time.
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

  // Validate and store a selected medicine image.
  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

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

  // Remove the selected image and any existing image URL.
  function removeImage() {
    setImageFile(null);
    setImagePreview("");
    setImageUrl("");
  }

  return {
    resetForm,
    handleTypeChange,
    toggleDosageTime,
    updateDosageQuantity,
    handleImageChange,
    removeImage,
  };
}
