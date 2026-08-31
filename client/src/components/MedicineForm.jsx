// client/src/components/MedicineForm.jsx

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
    <form onSubmit={submit} className="card space-y-6">
      {/* Medicine Name */}{" "}
      <div>
        {" "}
        <label>Medicine Name</label>
        <div className="relative">
          <Pill
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Enter medicine name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input !pl-10"
            required
          />
        </div>
      </div>
      {/* Medicine Image */}
      <div>
        <label>Medicine Image URL</label>

        <div className="relative">
          <ImagePlus
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Optional image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="input !pl-10"
          />
        </div>
      </div>
      {/* Dosage Schedule */}
      <div>
        <label>Dosage Schedule</label>

        <div className="grid grid-cols-3 gap-3 mt-3">
          {TIMES.map((time) => (
            <label
              key={time}
              className={`flex items-center justify-center gap-2 border rounded-xl px-3 py-3 cursor-pointer transition duration-150 ${
                dosageTimes.includes(time)
                  ? "border-blue-600 bg-blue-50 text-blue-600"
                  : "border-slate-200 text-slate-600 hover:border-blue-300"
              }`}
            >
              <input
                type="checkbox"
                checked={dosageTimes.includes(time)}
                onChange={() => toggleTime(time)}
                className="hidden"
              />

              <Clock3 size={16} />

              <span className="text-sm font-medium">
                {time.charAt(0).toUpperCase() + time.slice(1)}
              </span>
            </label>
          ))}
        </div>
      </div>
      {/* Start Month */}
      <div>
        <label>Start Month</label>

        <div className="relative">
          <CalendarDays
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />

          <input
            type="month"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="input !pl-10"
            required
          />
        </div>
      </div>
      {/* Currently Taking */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="w-4 h-4 accent-blue-600"
        />

        <div>
          <p className="font-medium text-slate-800">
            Currently taking this medicine
          </p>

          <p className="text-sm text-slate-500">
            Uncheck if this is a past medicine.
          </p>
        </div>
      </label>
      {/* End Month */}
      {!isActive && (
        <div>
          <label>End Month</label>

          <div className="relative">
            <CalendarDays
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />

            <input
              type="month"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
              className="input !pl-10"
              required
            />
          </div>
        </div>
      )}
      {/* Submit */}
      <button type="submit" className="btn-primary w-full">
        <Save size={18} />

        {editing ? "Update Medicine" : "Add Medicine"}
      </button>
    </form>
  );
}
