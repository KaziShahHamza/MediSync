// client/src/hooks/medicine-form/useMedicineForm.js

// Manages medicine form state, initialization, derived values, and submission.
// Delegates reusable field actions and image handling to useMedicineFormActions.

import { useEffect, useMemo, useRef, useState } from "react";

import { isStripMedicineType } from "../../data/medicineOptions";

import {
  createDateFromParts,
  getDateParts,
  getPricingTypeForType,
  getYearOptions,
  normalizeDosage,
} from "../../utils/medicine/medicineHelpers";

import { validateMedicineForm } from "../../utils/medicine/medicineValidation";

import useMedicineFormActions from "./useMedicineFormActions";

function getInitialFormState(editing) {
  if (!editing) {
    return {
      name: "",
      type: "tablet",
      dosage: [],
      pricePerStrip: "",
      piecesPerStrip: "",
      pricePerUnit: "",
      unitsPerMonth: "",
      imageUrl: "",
      imageFile: null,
      imagePreview: "",
      startMonth: "",
      startYear: new Date().getFullYear(),
      endMonth: "",
      endYear: "",
      isActive: true,
      error: "",
    };
  }

  const start = getDateParts(editing.startDate);
  const end = getDateParts(editing.endDate);
  const editingPricingType = getPricingTypeForType(editing.type);

  return {
    name: editing.name || "",
    type: editing.type || "tablet",
    dosage:
      editingPricingType === "strip" ? normalizeDosage(editing.dosage) : [],
    pricePerStrip: editing.pricePerStrip ?? "",
    piecesPerStrip: editing.piecesPerStrip ?? "",
    pricePerUnit: editing.pricePerUnit ?? "",
    unitsPerMonth: editing.unitsPerMonth ?? "",
    imageUrl: editing.imageUrl || "",
    imageFile: null,
    imagePreview: "",
    startMonth: start.month === "" ? "" : String(start.month),
    startYear: start.year || new Date().getFullYear(),
    endMonth: end.month === "" ? "" : String(end.month),
    endYear: end.year === "" ? "" : String(end.year),
    isActive: editing.isActive !== false,
    error: "",
  };
}

export default function useMedicineForm({ onSave, editing }) {
  // Initialize form state once when the form instance is mounted.
  const [initialState] = useState(() => getInitialFormState(editing));

  const [name, setName] = useState(initialState.name);
  const [type, setType] = useState(initialState.type);
  const [dosage, setDosage] = useState(initialState.dosage);
  const [pricePerStrip, setPricePerStrip] = useState(
    initialState.pricePerStrip,
  );
  const [piecesPerStrip, setPiecesPerStrip] = useState(
    initialState.piecesPerStrip,
  );
  const [pricePerUnit, setPricePerUnit] = useState(initialState.pricePerUnit);
  const [unitsPerMonth, setUnitsPerMonth] = useState(
    initialState.unitsPerMonth,
  );
  const [imageUrl, setImageUrl] = useState(initialState.imageUrl);
  const [imageFile, setImageFile] = useState(initialState.imageFile);
  const [imagePreview, setImagePreview] = useState(initialState.imagePreview);
  const [startMonth, setStartMonth] = useState(initialState.startMonth);
  const [startYear, setStartYear] = useState(initialState.startYear);
  const [endMonth, setEndMonth] = useState(initialState.endMonth);
  const [endYear, setEndYear] = useState(initialState.endYear);
  const [isActive, setIsActive] = useState(initialState.isActive);
  const [error, setError] = useState(initialState.error);

  const imagePreviewUrlRef = useRef(null);

  // Derive pricing mode from the selected medicine type.
  const pricingType = useMemo(() => getPricingTypeForType(type), [type]);

  // Generate the available treatment years once per form instance.
  const yearOptions = useMemo(() => getYearOptions(), []);

  const {
    resetForm,
    handleTypeChange,
    toggleDosageTime,
    updateDosageQuantity,
    handleImageChange: updateImageFile,
    removeImage: clearImage,
  } = useMedicineFormActions({
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
  });

  function revokeImagePreview() {
    // Release the previous temporary object URL before replacing it.
    if (imagePreviewUrlRef.current) {
      URL.revokeObjectURL(imagePreviewUrlRef.current);
      imagePreviewUrlRef.current = null;
    }
  }

  function handleImageChange(event) {
    // Let the shared action validate and store the selected image file.
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const isValidType = file.type.startsWith("image/");
    const isValidSize = file.size <= 5 * 1024 * 1024;

    updateImageFile(event);

    if (!isValidType || !isValidSize) {
      return;
    }

    // Remove any previous preview before creating a new object URL.
    revokeImagePreview();

    const objectUrl = URL.createObjectURL(file);

    // Store the temporary URL for both rendering and later cleanup.
    imagePreviewUrlRef.current = objectUrl;
    setImagePreview(objectUrl);
  }

  function removeImage() {
    // Release the temporary preview before clearing image state.
    revokeImagePreview();

    // Delegate the remaining image-state cleanup to the shared action.
    clearImage();
  }

  function resetMedicineForm() {
    // Release temporary browser resources before resetting the fields.
    revokeImagePreview();

    // Reset all form fields through the existing shared action.
    resetForm();
  }

  // Release temporary object URLs when the form is unmounted.
  useEffect(() => {
    return () => {
      revokeImagePreview();
    };
  }, []);

  async function handleSubmit(event) {
    // Prevent the browser from performing a normal form submission.
    event.preventDefault();

    // Clear any previous validation or submission error.
    setError("");

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
      // Stop submission when the normalized form data is invalid.
      setError(validationError);
      return;
    }

    const stripMedicine = isStripMedicineType(type);

    // Convert the selected month/year values into API-ready dates.
    const startDate = createDateFromParts(startMonth, startYear);

    const endDate = isActive ? null : createDateFromParts(endMonth, endYear);

    // Build the payload according to the selected pricing model.
    const medicineData = {
      name: name.trim(),
      type,
      pricingType,
      dosage: stripMedicine ? normalizeDosage(dosage) : [],
      pricePerStrip: stripMedicine ? Number(pricePerStrip) : null,
      piecesPerStrip: stripMedicine ? Number(piecesPerStrip) : null,
      pricePerUnit: stripMedicine ? null : Number(pricePerUnit),
      unitsPerMonth: stripMedicine ? null : Number(unitsPerMonth),
      imageUrl,
      imageFile,
      startDate,
      endDate,
      isActive,
    };

    try {
      // Delegate persistence to the parent component.
      await onSave(medicineData);

      // Reset only after the save operation succeeds.
      resetMedicineForm();
    } catch (submitError) {
      // Display the server or upload error without losing form data.
      setError(submitError?.message || "Failed to save medicine.");
    }
  }

  return {
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
    imageFile,
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

    pricingType,
    yearOptions,

    error,

    resetForm: resetMedicineForm,
    handleSubmit,
  };
}
