// client/src/hooks/useMedicineFormActions.js

// Handles medicine form field actions and image selection logic.
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
  // Resets all medicine form fields to their default values.
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

  // Updates medicine type and clears fields from the previous pricing mode.
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

  // Toggles a dosage timing entry in the medicine schedule.
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

  // Updates the quantity assigned to a dosage timing.
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

  // Validates and stores a newly selected medicine image.
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

  // Removes the selected image and its preview.
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