import { useEffect, useState } from "react";
import { Pill, ImagePlus, Clock3, Save, CalendarDays } from "lucide-react";

const TIMES = ["morning", "noon", "night"];

export default function MedicineForm({ onSave, editing }) {
  const [name, setName] = useState("");
  const [dosageTimes, setDosageTimes] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (editing) {
      setName(editing.name || "");
      setDosageTimes(editing.dosageTimes || []);
      setImageUrl(editing.imageUrl || "");

      setStartDate(
        editing.startDate
          ? new Date(editing.startDate).toISOString().slice(0, 7)
          : "",
      );

      setEndDate(
        editing.endDate
          ? new Date(editing.endDate).toISOString().slice(0, 7)
          : "",
      );

      setIsActive(editing.isActive ?? true);
    } else {
      setName("");
      setDosageTimes([]);
      setImageUrl("");
      setStartDate("");
      setEndDate("");
      setIsActive(true);
    }
  }, [editing]);

  const toggleTime = (time) => {
    setDosageTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time],
    );
  };

  const submit = (e) => {
    e.preventDefault();

    onSave({
      name,
      dosageTimes,
      imageUrl,
      startDate,
      endDate: isActive ? null : endDate,
      isActive,
    });

    setName("");
    setDosageTimes([]);
    setImageUrl("");
    setStartDate("");
    setEndDate("");
    setIsActive(true);
  };

  return (
    <form onSubmit={submit} className="ms-card ms-form ms-medicine-form">
      {/* Medicine Name */}
      <div className="ms-field">
        <label htmlFor="medicine-name" className="ms-label-2">
          Medicine Name
        </label>

        <div className="ms-input-with-icon">
          <Pill size={18} aria-hidden="true" />

          <input
            id="medicine-name"
            type="text"
            placeholder="Enter medicine name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="ms-input"
            required
          />
        </div>
      </div>

      {/* Medicine Image */}
      <div className="ms-field">
        <label htmlFor="medicine-image" className="ms-label-2">
          Medicine Image URL
        </label>

        <div className="ms-input-with-icon">
          <ImagePlus size={18} aria-hidden="true" />

          <input
            id="medicine-image"
            type="url"
            placeholder="Optional image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="ms-input"
          />
        </div>

        <p className="ms-help-text">
          Optional. Add an image URL to help identify the medicine.
        </p>
      </div>

      {/* Dosage Schedule */}
      <fieldset className="ms-form-section ms-medicine-dosage-section">
        <legend className="ms-label-2">Dosage Schedule</legend>

        <div className="ms-medicine-time-grid">
          {TIMES.map((time) => {
            const selected = dosageTimes.includes(time);

            return (
              <label
                key={time}
                className={`ms-medicine-time-option ${
                  selected ? "ms-medicine-time-option-selected" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={() => toggleTime(time)}
                />

                <span className="ms-medicine-time-check">
                  <Clock3 size={16} aria-hidden="true" />
                </span>

                <span className="ms-medicine-time-label">
                  {time.charAt(0).toUpperCase() + time.slice(1)}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Start Month */}
      <div className="ms-field">
        <label htmlFor="medicine-start-date" className="ms-label-2">
          Start Month
        </label>

        <div className="ms-input-with-icon">
          <CalendarDays size={18} aria-hidden="true" />

          <input
            id="medicine-start-date"
            type="month"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="ms-input"
            required
          />
        </div>
      </div>

      {/* Currently Taking */}
      <div className="ms-medicine-active-option">
        <label className="ms-checkbox-control">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />

          <span className="ms-checkbox-indicator" aria-hidden="true" />

          <span className="ms-checkbox-content">
            <span className="ms-checkbox-title">
              Currently taking this medicine
            </span>

            <span className="ms-checkbox-description">
              Uncheck if this is a past medicine.
            </span>
          </span>
        </label>
      </div>

      {/* End Month */}
      {!isActive && (
        <div className="ms-field">
          <label htmlFor="medicine-end-date" className="ms-label-2">
            End Month
          </label>

          <div className="ms-input-with-icon">
            <CalendarDays size={18} aria-hidden="true" />

            <input
              id="medicine-end-date"
              type="month"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              className="ms-input"
              required
            />
          </div>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        className="ms-btn ms-btn-primary ms-btn-full ms-medicine-submit"
      >
        <Save size={18} aria-hidden="true" />

        <span>{editing ? "Update Medicine" : "Add Medicine"}</span>
      </button>
    </form>
  );
}
