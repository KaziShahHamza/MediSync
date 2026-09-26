// client/src/hooks/useMedicineForm.js

// Manages medicine form state, initialization, derived values, and submission.
// Delegates reusable field actions and image handling to useMedicineFormActions.

import { useEffect, useMemo, useState } from "react";

import { isStripMedicineType } from "../data/medicine/medicineTypes";

import {
  createDateFromParts,
  getDateParts,
  getPricingTypeForType,
  getYearOptions,
  normalizeDosage,
} from "../utils/medicine/medicineHelpers";

import { validateMedicineForm } from "../utils/medicine/medicineValidation";

import useMedicineFormActions from "./useMedicineFormActions";

export default function useMedicineForm({ onSave, editing }) {
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

  // Derive pricing mode and available year options.
  const pricingType = useMemo(() => getPricingTypeForType(type), [type]);

  const yearOptions = useMemo(() => getYearOptions(), []);

  // Provide reusable medicine form actions.
  const {
    resetForm,
    handleTypeChange,
    toggleDosageTime,
    updateDosageQuantity,
    handleImageChange,
    removeImage,
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

  // Synchronize form fields with the medicine being edited.
  useEffect(() => {
    if (!editing) {
      resetForm();
      return;
    }

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
  }, [editing, resetForm]);

  // Create and clean up temporary image preview URLs.
  useEffect(() => {
    if (!imageFile) {
      setImagePreview("");
      return undefined;
    }

    const objectUrl = URL.createObjectURL(imageFile);

    setImagePreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageFile]);

  // Validate and submit the normalized medicine payload.
  async function handleSubmit(event) {
    event.preventDefault();
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
      setError(validationError);
      return;
    }

    const stripMedicine = isStripMedicineType(type);
    const startDate = createDateFromParts(startMonth, startYear);
    const endDate = isActive ? null : createDateFromParts(endMonth, endYear);

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
      await onSave(medicineData);
      resetForm();
    } catch (submitError) {
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
    resetForm,
    handleSubmit,
  };
}
