import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  ImagePlus,
  Pill,
  X,
} from "lucide-react";

import {
  getMedicinePricingType,
  getDailyMedicinePieces,
  getMonthlyMedicinePieces,
  getPricePerPiece,
  getMedicineMonthlyCost,
  formatMedicinePrice,
} from "../utils/medicineCalculations";

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

const MEDICINE_TYPES = [
  {
    value: "tablet",
    label: "Tablet",
  },
  {
    value: "capsule",
    label: "Capsule",
  },
  {
    value: "syrup",
    label: "Syrup",
  },
  {
    value: "antibiotic",
    label: "Antibiotic",
  },
  {
    value: "injection",
    label: "Injection",
  },
  {
    value: "cream",
    label: "Cream",
  },
  {
    value: "ointment",
    label: "Ointment",
  },
  {
    value: "drops",
    label: "Drops",
  },
  {
    value: "inhaler",
    label: "Inhaler",
  },
  {
    value: "other",
    label: "Other",
  },
];

function getYearOptions() {
  const currentYear =
    new Date().getFullYear();

  return Array.from(
    { length: 11 },
    (_, index) =>
      currentYear - 10 + index,
  );
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

function createDateFromParts(
  month,
  year,
) {
  if (
    month === "" ||
    year === ""
  ) {
    return null;
  }

  return new Date(
    Number(year),
    Number(month),
    1,
  );
}

function formatDateForPreview(
  month,
  year,
) {
  if (
    month === "" ||
    year === ""
  ) {
    return "";
  }

  const selectedMonth =
    MONTHS.find(
      (item) =>
        item.value === month,
    );

  return `${
    selectedMonth?.label || ""
  } ${year}`;
}

function normalizeDosage(
  dosage = [],
) {
  if (!Array.isArray(dosage)) {
    return [];
  }

  return dosage
    .filter(
      (item) =>
        item &&
        DOSAGE_OPTIONS.some(
          (option) =>
            option.value ===
            item.time,
        ),
    )
    .map((item) => ({
      time: item.time,
      quantity:
        Number(item.quantity) ||
        1,
    }));
}

function getPricingTypeForType(
  medicineType,
) {
  return medicineType ===
    "tablet" ||
    medicineType === "capsule"
    ? "strip"
    : "unit";
}

export default function MedicineForm({
  onSave,
  editing,
  onCancel,
  loading = false,
}) {
  const currentYear =
    new Date().getFullYear();

  const yearOptions = useMemo(
    () => getYearOptions(),
    [],
  );

  const [name, setName] =
    useState("");

  const [type, setType] =
    useState("tablet");

  const [dosage, setDosage] =
    useState([]);

  /*
   * Strip pricing
   */

  const [
    pricePerStrip,
    setPricePerStrip,
  ] = useState("");

  const [
    piecesPerStrip,
    setPiecesPerStrip,
  ] = useState("");

  /*
   * Unit pricing
   */

  const [
    pricePerUnit,
    setPricePerUnit,
  ] = useState("");

  const [
    unitsPerMonth,
    setUnitsPerMonth,
  ] = useState("");

  /*
   * Image
   */

  const [imageUrl, setImageUrl] =
    useState("");

  const [imageFile, setImageFile] =
    useState(null);

  const [
    imagePreview,
    setImagePreview,
  ] = useState("");

  /*
   * Dates
   */

  const [
    startMonth,
    setStartMonth,
  ] = useState("");

  const [
    startYear,
    setStartYear,
  ] = useState(
    String(currentYear),
  );

  const [endMonth, setEndMonth] =
    useState("");

  const [endYear, setEndYear] =
    useState("");

  const [isActive, setIsActive] =
    useState(true);

  const [error, setError] =
    useState("");

  /*
   * ========================================================
   * PRICING TYPE
   * ========================================================
   */

  const pricingType =
    getPricingTypeForType(type);

  const isStripMedicine =
    pricingType === "strip";

  /*
   * ========================================================
   * RESET
   * ========================================================
   */

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
    setStartYear(
      String(currentYear),
    );

    setEndMonth("");
    setEndYear("");

    setIsActive(true);
    setError("");
  }

  /*
   * ========================================================
   * INITIALIZE CREATE / EDIT
   * ========================================================
   */

  useEffect(() => {
    if (editing) {
      const startParts =
        getDateParts(
          editing.startDate,
        );

      const endParts =
        getDateParts(
          editing.endDate,
        );

      const editingType =
        editing.type || "tablet";

      const editingPricingType =
        getMedicinePricingType(
          editing,
        );

      setName(
        editing.name || "",
      );

      setType(editingType);

      /*
       * Only load dosage for strip medicines.
       */

      setDosage(
        editingPricingType ===
          "strip"
          ? normalizeDosage(
              editing.dosage,
            )
          : [],
      );

      /*
       * Strip pricing
       */

      setPricePerStrip(
        editing.pricePerStrip !=
          null
          ? String(
              editing.pricePerStrip,
            )
          : "",
      );

      setPiecesPerStrip(
        editing.piecesPerStrip !=
          null
          ? String(
              editing.piecesPerStrip,
            )
          : "",
      );

      /*
       * Unit pricing
       */

      setPricePerUnit(
        editing.pricePerUnit !=
          null
          ? String(
              editing.pricePerUnit,
            )
          : "",
      );

      setUnitsPerMonth(
        editing.unitsPerMonth !=
          null
          ? String(
              editing.unitsPerMonth,
            )
          : "",
      );

      setImageUrl(
        editing.imageUrl || "",
      );

      setImageFile(null);

      setImagePreview(
        editing.imageUrl || "",
      );

      setStartMonth(
        startParts.month,
      );

      setStartYear(
        startParts.year ||
          String(currentYear),
      );

      setEndMonth(
        endParts.month,
      );

      setEndYear(
        endParts.year,
      );

      setIsActive(
        editing.isActive !== false,
      );

      setError("");
    } else {
      resetForm();
    }
  }, [
    editing,
    currentYear,
  ]);

  /*
   * ========================================================
   * CHANGE MEDICINE TYPE
   * ========================================================
   */

  function handleTypeChange(
    newType,
  ) {
    setType(newType);

    const newPricingType =
      getPricingTypeForType(
        newType,
      );

    /*
     * Clear pricing data that no longer
     * belongs to the selected type.
     */

    if (
      newPricingType === "strip"
    ) {
      setPricePerUnit("");
      setUnitsPerMonth("");
    } else {
      setDosage([]);
      setPricePerStrip("");
      setPiecesPerStrip("");
    }

    setError("");
  }

  /*
   * ========================================================
   * IMAGE PREVIEW CLEANUP
   * ========================================================
   */

  useEffect(() => {
    if (!imageFile) {
      return undefined;
    }

    const objectUrl =
      URL.createObjectURL(
        imageFile,
      );

    setImagePreview(objectUrl);

    return () => {
      URL.revokeObjectURL(
        objectUrl,
      );
    };
  }, [imageFile]);

  /*
   * ========================================================
   * DOSAGE HELPERS
   * ========================================================
   */

  function handleDosageChange(
    value,
  ) {
    setDosage((previous) => {
      const existing =
        previous.find(
          (item) =>
            item.time === value,
        );

      if (existing) {
        return previous.filter(
          (item) =>
            item.time !== value,
        );
      }

      return [
        ...previous,
        {
          time: value,
          quantity: 1,
        },
      ];
    });
  }

  function handleDosageQuantityChange(
    time,
    value,
  ) {
    setDosage((previous) =>
      previous.map((item) =>
        item.time === time
          ? {
              ...item,
              quantity: value,
            }
          : item,
      ),
    );
  }

  /*
   * ========================================================
   * IMAGE
   * ========================================================
   */

  function handleImageChange(
    event,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !file.type.startsWith(
        "image/",
      )
    ) {
      setError(
        "Please select a valid image file.",
      );
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      setError(
        "Image size must be 5 MB or less.",
      );
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

  /*
   * ========================================================
   * DATE HELPERS
   * ========================================================
   */

  function handleStartYearChange(
    value,
  ) {
    setStartYear(value);

    if (
      endYear &&
      Number(endYear) <
        Number(value)
    ) {
      setEndYear("");
      setEndMonth("");
    }
  }

  /*
   * ========================================================
   * LIVE COST CALCULATION
   * ========================================================
   */

  const previewMedicine = {
    type,
    pricingType,

    dosage:
      isStripMedicine
        ? dosage
        : [],

    pricePerStrip:
      isStripMedicine
        ? pricePerStrip
        : null,

    piecesPerStrip:
      isStripMedicine
        ? piecesPerStrip
        : null,

    pricePerUnit:
      !isStripMedicine
        ? pricePerUnit
        : null,

    unitsPerMonth:
      !isStripMedicine
        ? unitsPerMonth
        : null,
  };

  const dailyPieces =
    isStripMedicine
      ? getDailyMedicinePieces(
          dosage,
        )
      : 0;

  const monthlyPieces =
    isStripMedicine
      ? getMonthlyMedicinePieces(
          dosage,
        )
      : 0;

  const pricePerPiece =
    isStripMedicine
      ? getPricePerPiece(
          pricePerStrip,
          piecesPerStrip,
        )
      : 0;

  const monthlyCost =
    getMedicineMonthlyCost(
      previewMedicine,
    );

  const hasPricingInput =
    isStripMedicine
      ? pricePerStrip !== "" ||
        piecesPerStrip !== "" ||
        dosage.length > 0
      : pricePerUnit !== "" ||
        unitsPerMonth !== "";

  /*
   * ========================================================
   * SUBMIT
   * ========================================================
   */

  async function handleSubmit(
    event,
  ) {
    event.preventDefault();
    setError("");

    /*
     * --------------------------------------------------------
     * Name
     * --------------------------------------------------------
     */

    if (!name.trim()) {
      setError(
        "Medicine name is required.",
      );
      return;
    }

    if (!type) {
      setError(
        "Please select a medicine type.",
      );
      return;
    }

    /*
     * ========================================================
     * STRIP VALIDATION
     * ========================================================
     */

    if (isStripMedicine) {
      if (dosage.length === 0) {
        setError(
          "Please select at least one dosage time.",
        );
        return;
      }

      const hasInvalidDosage =
        dosage.some(
          (item) =>
            !Number.isFinite(
              Number(
                item.quantity,
              ),
            ) ||
            !Number.isInteger(
              Number(
                item.quantity,
              ),
            ) ||
            Number(
              item.quantity,
            ) < 1,
        );

      if (hasInvalidDosage) {
        setError(
          "Each dosage quantity must be a positive integer.",
        );
        return;
      }

      if (
        pricePerStrip === "" ||
        !Number.isFinite(
          Number(
            pricePerStrip,
          ),
        ) ||
        Number(
          pricePerStrip,
        ) <= 0
      ) {
        setError(
          "Please enter a valid price per strip/পাতা.",
        );
        return;
      }

      if (
        piecesPerStrip === "" ||
        !Number.isFinite(
          Number(
            piecesPerStrip,
          ),
        ) ||
        !Number.isInteger(
          Number(
            piecesPerStrip,
          ),
        ) ||
        Number(
          piecesPerStrip,
        ) < 1
      ) {
        setError(
          "Pieces per strip/পাতা must be a positive integer.",
        );
        return;
      }
    }

    /*
     * ========================================================
     * UNIT VALIDATION
     * ========================================================
     */

    if (!isStripMedicine) {
      if (
        pricePerUnit === "" ||
        !Number.isFinite(
          Number(pricePerUnit),
        ) ||
        Number(pricePerUnit) <= 0
      ) {
        setError(
          "Please enter a valid price per unit.",
        );
        return;
      }

      if (
        unitsPerMonth === "" ||
        !Number.isFinite(
          Number(unitsPerMonth),
        ) ||
        !Number.isInteger(
          Number(unitsPerMonth),
        ) ||
        Number(unitsPerMonth) < 1
      ) {
        setError(
          "Units needed per month must be a positive integer.",
        );
        return;
      }
    }

    /*
     * ========================================================
     * DATE VALIDATION
     * ========================================================
     */

    if (
      startMonth === "" ||
      startYear === ""
    ) {
      setError(
        "Please select the start month and year.",
      );
      return;
    }

    if (
      !isActive &&
      (endMonth === "" ||
        endYear === "")
    ) {
      setError(
        "Please select the end month and year.",
      );
      return;
    }

    const startDate =
      createDateFromParts(
        startMonth,
        startYear,
      );

    const endDate = isActive
      ? null
      : createDateFromParts(
          endMonth,
          endYear,
        );

    if (!startDate) {
      setError(
        "Please select a valid start date.",
      );
      return;
    }

    if (
      !isActive &&
      (!endDate ||
        endDate < startDate)
    ) {
      setError(
        "End month cannot be earlier than the start month.",
      );
      return;
    }

    /*
     * ========================================================
     * SAVE
     * ========================================================
     */

    try {
      await onSave({
        name: name.trim(),

        type,

        pricingType,

        dosage:
          isStripMedicine
            ? dosage.map(
                (item) => ({
                  time: item.time,
                  quantity:
                    Number(
                      item.quantity,
                    ),
                }),
              )
            : [],

        pricePerStrip:
          isStripMedicine
            ? Number(
                pricePerStrip,
              )
            : null,

        piecesPerStrip:
          isStripMedicine
            ? Number(
                piecesPerStrip,
              )
            : null,

        pricePerUnit:
          !isStripMedicine
            ? Number(
                pricePerUnit,
              )
            : null,

        unitsPerMonth:
          !isStripMedicine
            ? Number(
                unitsPerMonth,
              )
            : null,

        imageUrl,
        imageFile,

        startDate,
        endDate,
        isActive,
      });

      resetForm();
    } catch (error) {
      console.error(
        "Medicine form save error:",
        error,
      );

      setError(
        error.message ||
          "Failed to save medicine.",
      );
    }
  }

  const startPreview =
    formatDateForPreview(
      startMonth,
      startYear,
    );

  const endPreview =
    formatDateForPreview(
      endMonth,
      endYear,
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 card"
    >
      {/* FORM HEADER */}

      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Pill size={20} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {editing
              ? "Edit medicine"
              : "Add medicine"}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Keep your medicine
            information organized.
          </p>
        </div>
      </div>

      {/* MEDICINE NAME */}

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
          onChange={(event) =>
            setName(
              event.target.value,
            )
          }
          placeholder="Enter medicine name"
          className="input"
          required
          disabled={loading}
        />

        
      </div>

      {/* MEDICINE TYPE */}

      <div>
        <label
          htmlFor="medicine-type"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Medicine type
        </label>

        <select
          id="medicine-type"
          value={type}
          onChange={(event) =>
            handleTypeChange(
              event.target.value,
            )
          }
          className="input"
          disabled={loading}
        >
          {MEDICINE_TYPES.map(
            (option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ),
          )}
        </select>

        <p className="mt-2 text-xs text-slate-500">
          {isStripMedicine
            ? "This medicine is priced by strip/পাতা."
            : "This medicine is priced by unit."}
        </p>
      </div>

      {/* ====================================================
          STRIP MEDICINE SECTION
          ==================================================== */}

      {isStripMedicine && (
        <>
          {/* DOSAGE */}

          <div>
            <p className="mb-2 text-sm font-medium text-slate-700">
              Dosage schedule
            </p>

            <div className="space-y-3">
              {DOSAGE_OPTIONS.map(
                (option) => {
                  const selected =
                    dosage.find(
                      (item) =>
                        item.time ===
                        option.value,
                    );

                  return (
                    <div
                      key={
                        option.value
                      }
                      className={`rounded-xl border p-3 transition ${
                        selected
                          ? "border-blue-500 bg-blue-50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          checked={Boolean(
                            selected,
                          )}
                          onChange={() =>
                            handleDosageChange(
                              option.value,
                            )
                          }
                          className="h-4 w-4 accent-blue-600"
                          disabled={
                            loading
                          }
                        />

                        <span
                          className={`text-sm font-medium ${
                            selected
                              ? "text-blue-700"
                              : "text-slate-700"
                          }`}
                        >
                          {
                            option.label
                          }
                        </span>
                      </label>

                      {selected && (
                        <div className="mt-3 ml-6 flex items-center gap-3">
                          <label
                            htmlFor={`dosage-${option.value}`}
                            className="text-sm text-slate-600"
                          >
                            Pieces per dose
                          </label>

                          <input
                            id={`dosage-${option.value}`}
                            type="number"
                            min="1"
                            step="1"
                            value={
                              selected.quantity
                            }
                            onChange={(
                              event,
                            ) =>
                              handleDosageQuantityChange(
                                option.value,
                                event
                                  .target
                                  .value,
                              )
                            }
                            className="input w-28"
                            disabled={
                              loading
                            }
                          />
                        </div>
                      )}
                    </div>
                  );
                },
              )}
            </div>
          </div>

          {/* STRIP PRICING */}

          <div>
            <p className="mb-3 text-sm font-medium text-slate-700">
              Strip pricing
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* PRICE PER STRIP */}

              <div>
                <label
                  htmlFor="price-per-strip"
                  className="mb-2 block text-xs font-medium text-slate-600"
                >
                  Price per strip/পাতা
                </label>

                <div className="relative">
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    ৳
                  </span>

                  <input
                    id="price-per-strip"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={
                      pricePerStrip
                    }
                    onChange={(
                      event,
                    ) =>
                      setPricePerStrip(
                        event.target
                          .value,
                      )
                    }
                    placeholder="20"
                    className="input !pl-8"
                    disabled={
                      loading
                    }
                  />
                </div>
              </div>

              {/* PIECES PER STRIP */}

              <div>
                <label
                  htmlFor="pieces-per-strip"
                  className="mb-2 block text-xs font-medium text-slate-600"
                >
                  Pieces per strip/পাতা
                </label>

                <input
                  id="pieces-per-strip"
                  type="number"
                  min="1"
                  step="1"
                  value={
                    piecesPerStrip
                  }
                  onChange={(
                    event,
                  ) =>
                    setPiecesPerStrip(
                      event.target
                        .value,
                    )
                  }
                  placeholder="10"
                  className="input"
                  disabled={
                    loading
                  }
                />
              </div>
            </div>

            {/* STRIP COST PREVIEW */}

            {hasPricingInput && (
              <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-slate-500">
                      Price per piece
                    </p>

                    <p className="mt-1 text-lg font-semibold text-slate-900">
                      {formatMedicinePrice(
                        pricePerPiece,
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Daily usage
                    </p>

                    <p className="mt-1 text-lg font-semibold text-slate-900">
                      {dailyPieces}{" "}
                      {dailyPieces ===
                      1
                        ? "piece"
                        : "pieces"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">
                      Monthly usage
                    </p>

                    <p className="mt-1 text-lg font-semibold text-slate-900">
                      {
                        monthlyPieces
                      }{" "}
                      {monthlyPieces ===
                      1
                        ? "piece"
                        : "pieces"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 border-t border-blue-100 pt-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Estimated monthly medicine cost
                  </p>

                  <p className="mt-1 text-2xl font-bold text-blue-700">
                    {formatMedicinePrice(
                      monthlyCost,
                    )}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Based on 30 days of
                    medicine use.
                  </p>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ====================================================
          UNIT MEDICINE SECTION
          ==================================================== */}

      {!isStripMedicine && (
        <div>
          <p className="mb-3 text-sm font-medium text-slate-700">
            Unit pricing
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* PRICE PER UNIT */}

            <div>
              <label
                htmlFor="price-per-unit"
                className="mb-2 block text-xs font-medium text-slate-600"
              >
                Price per unit
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  ৳
                </span>

                <input
                  id="price-per-unit"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={
                    pricePerUnit
                  }
                  onChange={(
                    event,
                  ) =>
                    setPricePerUnit(
                      event.target
                        .value,
                    )
                  }
                  placeholder="100"
                  className="input !pl-8"
                  disabled={
                    loading
                  }
                />
              </div>
            </div>

            {/* UNITS PER MONTH */}

            <div>
              <label
                htmlFor="units-per-month"
                className="mb-2 block text-xs font-medium text-slate-600"
              >
                Units needed per month
              </label>

              <input
                id="units-per-month"
                type="number"
                min="1"
                step="1"
                value={
                  unitsPerMonth
                }
                onChange={(
                  event,
                ) =>
                  setUnitsPerMonth(
                    event.target
                      .value,
                  )
                }
                placeholder="2"
                className="input"
                disabled={loading}
              />
            </div>
          </div>

          {/* UNIT COST PREVIEW */}

          {hasPricingInput && (
            <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-slate-500">
                    Units needed per month
                  </p>

                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {Number(
                      unitsPerMonth,
                    ) || 0}{" "}
                    {Number(
                      unitsPerMonth,
                    ) === 1
                      ? "unit"
                      : "units"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Price per unit
                  </p>

                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {formatMedicinePrice(
                      pricePerUnit,
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-4 border-t border-blue-100 pt-4">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Estimated monthly medicine cost
                </p>

                <p className="mt-1 text-2xl font-bold text-blue-700">
                  {formatMedicinePrice(
                    monthlyCost,
                  )}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Based on your estimated
                  monthly unit usage.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ====================================================
          MEDICINE IMAGE
          ==================================================== */}

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
              onChange={
                handleImageChange
              }
              className="sr-only"
              disabled={loading}
            />
          </label>
        )}
      </div>

      {/* ====================================================
          START MONTH
          ==================================================== */}

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
              onChange={(event) =>
                setStartMonth(
                  event.target
                    .value,
                )
              }
              className="input !pl-10"
              required
              disabled={loading}
            >
              <option value="">
                Select month
              </option>

              {MONTHS.map(
                (month) => (
                  <option
                    key={
                      month.value
                    }
                    value={
                      month.value
                    }
                  >
                    {
                      month.label
                    }
                  </option>
                ),
              )}
            </select>
          </div>

          <select
            value={startYear}
            onChange={(event) =>
              handleStartYearChange(
                event.target
                  .value,
              )
            }
            className="input"
            required
            disabled={loading}
          >
            <option value="">
              Select year
            </option>

            {yearOptions.map(
              (year) => (
                <option
                  key={year}
                  value={year}
                >
                  {year}
                </option>
              ),
            )}
          </select>
        </div>

        {startPreview && (
          <p className="mt-2 text-xs text-slate-500">
            Selected start:{" "}
            {startPreview}
          </p>
        )}
      </div>

      {/* ====================================================
          CURRENTLY TAKING
          ==================================================== */}

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(event) => {
            const checked =
              event.target.checked;

            setIsActive(checked);

            if (checked) {
              setEndMonth("");
              setEndYear("");
            }
          }}
          className="mt-1 h-4 w-4 accent-blue-600"
          disabled={loading}
        />

        <div>
          <p className="font-medium text-slate-800">
            Currently taking this
            medicine
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Uncheck if this is a
            past medicine.
          </p>
        </div>
      </label>

      {/* ====================================================
          END MONTH
          ==================================================== */}

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
                value={
                  endMonth
                }
                onChange={(
                  event,
                ) =>
                  setEndMonth(
                    event.target
                      .value,
                  )
                }
                className="input !pl-10"
                required
                disabled={loading}
              >
                <option value="">
                  Select month
                </option>

                {MONTHS.map(
                  (month) => (
                    <option
                      key={
                        month.value
                      }
                      value={
                        month.value
                      }
                    >
                      {
                        month.label
                      }
                    </option>
                  ),
                )}
              </select>
            </div>

            <select
              value={endYear}
              onChange={(event) =>
                setEndYear(
                  event.target
                    .value,
                )
              }
              className="input"
              required
              disabled={loading}
            >
              <option value="">
                Select year
              </option>

              {yearOptions.map(
                (year) => (
                  <option
                    key={year}
                    value={year}
                  >
                    {year}
                  </option>
                ),
              )}
            </select>
          </div>

          {endPreview && (
            <p className="mt-2 text-xs text-slate-500">
              Selected end:{" "}
              {endPreview}
            </p>
          )}
        </div>
      )}

      {/* ====================================================
          ERROR
          ==================================================== */}

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* ====================================================
          ACTIONS
          ==================================================== */}

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