// client/src/hooks/useMedicineForm.js

// Manages medicine form state, initialization, derived values, and submission.
// Uses separate actions for field updates while keeping submission logic here.

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

  const pricingType = useMemo(() => getPricingTypeForType(type), [type]);

  const yearOptions = useMemo(() => getYearOptions(), []);

  // Provides medicine form field actions and image handling.
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

  // Synchronizes form state when editing an existing medicine.
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
  }, [editing]);

  // Creates and cleans up temporary image preview URLs.
  useEffect(() => {
    if (!imageFile) {
      setImagePreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(imageFile);

    setImagePreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageFile]);

  // Validates and submits the normalized medicine payload.
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

    const startDate = createDateFromParts(startMonth, startYear);

    const endDate = isActive ? null : createDateFromParts(endMonth, endYear);

    const normalizedDosage = normalizeDosage(dosage);

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
