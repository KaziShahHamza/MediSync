import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ImagePlus, Pill, Upload, X } from "lucide-react";

const MONTHS = [
  { value: "0", label: "January" },
  { value: "1", label: "February" },
  { value: "2", label: "March" },
  { value: "3", label: "April" },
  { value: "4", label: "May" },
  { value: "5", label: "June" },
  { value: "6", label: "July" },
  { value: "7", label: "August" },
  { value: "8", label: "September" },
  { value: "9", label: "October" },
  { value: "10", label: "November" },
  { value: "11", label: "December" },
];

const DOSAGE_OPTIONS = [
  {
    value: "morning",
    label: "Morning",
  },
  {
    value: "noon",
    label: "Noon",
  },
  {
    value: "night",
    label: "Night",
  },
];

function getYearOptions() {
  const currentYear = new Date().getFullYear();

  return Array.from({ length: 11 }, (_, index) => currentYear - 10 + index);
}

function getDateParts(dateValue) {
  if (!dateValue) {
    return {
      month: "",
      year: "",
    };
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return {
      month: "",
      year: "",
    };
  }

  return {
    month: String(date.getMonth()),
    year: String(date.getFullYear()),
  };
}

function createDateFromParts(month, year) {
  if (month === "" || year === "") {
    return null;
  }

  return new Date(Number(year), Number(month), 1);
}

function formatDateForPreview(month, year) {
  if (month === "" || year === "") {
    return "";
  }

  const selectedMonth = MONTHS.find((item) => item.value === month);

  return `${selectedMonth?.label || ""} ${year}`;
}

export default function MedicineForm({
  onSave,
  editing,
  onCancel,
  loading = false,
}) {
  const currentYear = new Date().getFullYear();
  const yearOptions = useMemo(() => getYearOptions(), []);

  const [name, setName] = useState("");
  const [dosageTimes, setDosageTimes] = useState([]);

  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [startMonth, setStartMonth] = useState("");
  const [startYear, setStartYear] = useState(String(currentYear));

  const [endMonth, setEndMonth] = useState("");
  const [endYear, setEndYear] = useState("");

  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");

  function resetForm() {
    setName("");
    setDosageTimes([]);

    setImageUrl("");
    setImageFile(null);
    setImagePreview("");

    setStartMonth("");
    setStartYear(String(currentYear));

    setEndMonth("");
    setEndYear("");

    setIsActive(true);
    setError("");
  }

  /*
   * ========================================================
   * INITIALIZE FORM FOR CREATE / EDIT
   * ========================================================
   */

  useEffect(() => {
    if (editing) {
      const startParts = getDateParts(editing.startDate);
      const endParts = getDateParts(editing.endDate);

      setName(editing.name || "");
      setDosageTimes(editing.dosageTimes || []);

      setImageUrl(editing.imageUrl || "");
      setImageFile(null);
      setImagePreview(editing.imageUrl || "");

      setStartMonth(startParts.month);
      setStartYear(startParts.year || String(currentYear));

      setEndMonth(endParts.month);
      setEndYear(endParts.year);

      setIsActive(editing.isActive !== false);
      setError("");
    } else {
      resetForm();
    }
  }, [editing, currentYear]);

  /*
   * ========================================================
   * IMAGE PREVIEW CLEANUP
   * ========================================================
   */

  useEffect(() => {
    if (!imageFile) {
      return undefined;
    }

    const objectUrl = URL.createObjectURL(imageFile);

    setImagePreview(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [imageFile]);

  /*
   * ========================================================
   * FORM HELPERS
   * ========================================================
   */

  function handleDosageChange(value) {
    setDosageTimes((previous) =>
      previous.includes(value)
        ? previous.filter((item) => item !== value)
        : [...previous, value],
    );
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be 5 MB or less.");
      return;
    }

    setError("");
    setImageFile(file);
    setImageUrl("");
  }

  function removeImage() {
    setImageFile(null);
    setImageUrl("");
    setImagePreview("");
  }

  function handleStartYearChange(value) {
    setStartYear(value);

    if (endYear && Number(endYear) < Number(value)) {
      setEndYear("");
      setEndMonth("");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Medicine name is required.");
      return;
    }

    if (startMonth === "" || startYear === "") {
      setError("Please select the start month and year.");
      return;
    }

    if (!isActive && (endMonth === "" || endYear === "")) {
      setError("Please select the end month and year.");
      return;
    }

    const startDate = createDateFromParts(startMonth, startYear);

    const endDate = isActive ? null : createDateFromParts(endMonth, endYear);

    if (!startDate) {
      setError("Please select a valid start date.");
      return;
    }

    if (!isActive && (!endDate || endDate < startDate)) {
      setError("End month cannot be earlier than the start month.");
      return;
    }

    try {
      await onSave({
        name: name.trim(),
        dosageTimes,
        imageUrl,
        imageFile,
        startDate,
        endDate,
        isActive,
      });

      // Reset only after successful save
      resetForm();
    } catch (error) {
      console.error("Medicine form save error:", error);

      setError(error.message || "Failed to save medicine.");
    }
  }

  const startPreview = formatDateForPreview(startMonth, startYear);

  const endPreview = formatDateForPreview(endMonth, endYear);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 card">
      {/* ==================================================
          FORM HEADER
      ================================================== */}

      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Pill size={20} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {editing ? "Edit medicine" : "Add medicine"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Keep your medicine information organized.
          </p>
        </div>
      </div>

      {/* ==================================================
          MEDICINE NAME
      ================================================== */}

      <div>
        <label
          htmlFor="medicine-name"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Medicine name
        </label>

        <input
          id="medicine-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter medicine name"
          className="input"
          required
          disabled={loading}
        />
      </div>

      {/* ==================================================
          DOSAGE TIMES
      ================================================== */}

      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">Dosage time</p>

        <div className="grid gap-3 sm:grid-cols-3">
          {DOSAGE_OPTIONS.map((option) => {
            const selected = dosageTimes.includes(option.value);

            return (
              <label
                key={option.value}
                className={[
                  "flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-3 text-sm transition",
                  selected
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-blue-300",
                ].join(" ")}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => handleDosageChange(option.value)}
                  className="h-4 w-4 accent-blue-600"
                  disabled={loading}
                />

                <span>{option.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* ==================================================
          MEDICINE IMAGE
      ================================================== */}

      <div>
        <p className="mb-2 text-sm font-medium text-slate-700">
          Medicine image
        </p>

        {imagePreview ? (
          <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            <img
              src={imagePreview}
              alt="Medicine preview"
              className="h-48 w-full object-contain"
            />

            <button
              type="button"
              onClick={removeImage}
              disabled={loading}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm transition hover:bg-red-50 hover:text-red-600"
              aria-label="Remove medicine image"
            >
              <X size={17} />
            </button>
          </div>
        ) : (
          <label
            htmlFor="medicine-image"
            className="flex min-h-36 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-blue-400 hover:bg-blue-50/40"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
              <ImagePlus size={20} />
            </div>

            <span className="text-sm font-medium text-slate-700">
              Upload medicine image
            </span>

            <span className="text-xs text-slate-500">
              PNG, JPG, or WEBP up to 5 MB
            </span>

            <input
              id="medicine-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="sr-only"
              disabled={loading}
            />
          </label>
        )}
      </div>

      {/* ==================================================
          START MONTH
      ================================================== */}

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Start month
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="relative">
            <CalendarDays
              size={18}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={startMonth}
              onChange={(event) => setStartMonth(event.target.value)}
              className="input !pl-10"
              required
              disabled={loading}
            >
              <option value="">Select month</option>

              {MONTHS.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>

          <select
            value={startYear}
            onChange={(event) => handleStartYearChange(event.target.value)}
            className="input"
            required
            disabled={loading}
          >
            <option value="">Select year</option>

            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {startPreview && (
          <p className="mt-2 text-xs text-slate-500">
            Selected start: {startPreview}
          </p>
        )}
      </div>

      {/* ==================================================
          CURRENTLY TAKING
      ================================================== */}

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(event) => {
            setIsActive(event.target.checked);

            if (event.target.checked) {
              setEndMonth("");
              setEndYear("");
            }
          }}
          className="mt-1 h-4 w-4 accent-blue-600"
          disabled={loading}
        />

        <div>
          <p className="font-medium text-slate-800">
            Currently taking this medicine
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Uncheck if this is a past medicine.
          </p>
        </div>
      </label>

      {/* ==================================================
          END MONTH
      ================================================== */}

      {!isActive && (
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            End month
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="relative">
              <CalendarDays
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={endMonth}
                onChange={(event) => setEndMonth(event.target.value)}
                className="input !pl-10"
                required
                disabled={loading}
              >
                <option value="">Select month</option>

                {MONTHS.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={endYear}
              onChange={(event) => setEndYear(event.target.value)}
              className="input"
              required
              disabled={loading}
            >
              <option value="">Select year</option>

              {yearOptions.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {endPreview && (
            <p className="mt-2 text-xs text-slate-500">
              Selected end: {endPreview}
            </p>
          )}
        </div>
      )}

      {/* ==================================================
          ERROR
      ================================================== */}

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* ==================================================
          ACTIONS
      ================================================== */}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {editing && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="btn-secondary"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary inline-flex items-center justify-center gap-2"
        >
          {loading && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          )}

          {loading
            ? "Saving..."
            : editing
              ? "Update medicine"
              : "Save medicine"}
        </button>
      </div>
    </form>
  );
}
