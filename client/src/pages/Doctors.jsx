// src/pages/Doctors.jsx
import { useState } from "react";
import { useDoctors } from "../context/DoctorContext";
import DoctorCard from "../components/DoctorCard";

const hospitals = [
  "Square Hospital",
  "Evercare Hospital Dhaka",
  "United Hospital Limited",
  "Apollo Hospitals Dhaka",
  "Labaid Specialized Hospital",
  "Popular Diagnostic Centre",
  "Ibn Sina Hospital",
  "BSMMU",
  "Dhaka Medical College Hospital",
  "National Heart Foundation Hospital",
];

const specialties = [
  "Diabetes Specialist",
  "Cardiologist",
  "Neurologist",
  "Dermatologist",
  "Orthopedic",
  "Gastroenterologist",
  "ENT Specialist",
  "Kidney Specialist",
  "Child Specialist",
  "Medicine Specialist",
];

const designations = [
  "Professor",
  "Associate Professor",
  "Assistant Professor",
];

const days = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const emptyForm = {
  name: "",
  designation: "",
  specialty: "",
  hospital: "",
  chamber: "",
  visitingDays: [],
  visitingTime: "",
  phone: "",
  notes: "",
};

export default function Doctors() {

  const {
    doctors,
    fetchDoctors,
  } = useDoctors();


  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);


  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }


  function toggleDay(day) {

    setForm(prev => ({
      ...prev,

      visitingDays: prev.visitingDays.includes(day)

        ? prev.visitingDays.filter(d => d !== day)

        : [...prev.visitingDays, day],

    }));

  }


  function selectSpecialty(value) {

    setForm({
      ...form,
      specialty: value,
    });

  }


  function editDoctor(doctor) {

    setEditingId(doctor._id);

    setForm({
      ...doctor,

      visitingDays:
        doctor.visitingDays || [],

    });

  }


  async function saveDoctor(e) {

    e.preventDefault();

    const token = localStorage.getItem("token");


    await fetch(

      editingId
        ? `http://localhost:5000/api/doctors/${editingId}`
        : "http://localhost:5000/api/doctors",

      {

        method: editingId ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(form),

      }

    );


    setForm(emptyForm);

    setEditingId(null);

    fetchDoctors();

  }


  async function deleteDoctor(id) {

    const token = localStorage.getItem("token");


    await fetch(

      `http://localhost:5000/api/doctors/${id}`,

      {

        method:"DELETE",

        headers:{
          Authorization:`Bearer ${token}`,
        },

      }

    );


    fetchDoctors();

  }



  return (

    <div className="container py-8">

      <h1 className="text-3xl font-bold mb-8">
        My Doctors
      </h1>

      <div className="grid lg:grid-cols-2 gap-8 items-start">

        <section>
          <div className="flex items-center mb-5">
            <h2 className="text-xl font-semibold">
              Doctor Cards
            </h2>
            <p className="text-sm text-slate-500">
              {doctors.length} item{doctors.length === 1 ? "" : "s"}
            </p>
          </div>

          {doctors.length ? (
            <div className="grid grid-cols-1 gap-6">
              {doctors.map((doctor) => (
                <DoctorCard
                  key={doctor._id}
                  doctor={doctor}
                  onEdit={editDoctor}
                  onDelete={deleteDoctor}
                />
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center text-slate-500">
              No doctors added yet.
            </div>
          )}
        </section>

        <aside className="card p-6 space-y-6 sticky top-24">
          <div>
            <h2 className="text-xl font-semibold">
              Doctor Form
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Add or update doctor details.
            </p>
          </div>

          <form
            onSubmit={saveDoctor}
            className="space-y-6"
          >
            <input
              name="name"
              placeholder="Doctor Name"
              value={form.name}
              onChange={handleChange}
              className="input w-full"
            />

            <div>
              <p className="mb-2 font-medium">
                Designation
              </p>

              <div className="grid gap-2">
                {designations.map((designation) => (
                  <label
                    key={designation}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="radio"
                      name="designation"
                      value={designation}
                      checked={form.designation === designation}
                      onChange={handleChange}
                    />
                    {designation}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 font-medium">
                Specialty
              </p>

              <div className="grid md:grid-cols-2 gap-2">
                {specialties.map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-2"
                  >
                    <input
                      type="radio"
                      checked={form.specialty === item}
                      onChange={() => selectSpecialty(item)}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <select
              name="hospital"
              value={form.hospital}
              onChange={handleChange}
              className="input w-full"
            >
              <option value="">
                Select Hospital
              </option>
              {hospitals.map((h) => (
                <option key={h}>
                  {h}
                </option>
              ))}
            </select>

            <input
              name="chamber"
              placeholder="Chamber Address"
              value={form.chamber}
              onChange={handleChange}
              className="input w-full"
            />

            <div>
              <p className="font-medium mb-2">
                Visiting Days
              </p>

              <div className="grid md:grid-cols-3 gap-2">
                {days.map((day) => (
                  <label key={day} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={form.visitingDays.includes(day)}
                      onChange={() => toggleDay(day)}
                    />
                    <span>{day}</span>
                  </label>
                ))}
              </div>
            </div>

            <input
              name="visitingTime"
              placeholder="Visiting Time (Example: 6 PM - 9 PM)"
              value={form.visitingTime}
              onChange={handleChange}
              className="input w-full"
            />

            <input
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="input w-full"
            />

            <textarea
              name="notes"
              placeholder="Notes"
              value={form.notes}
              onChange={handleChange}
              className="input w-full"
            />

            <button className="btn-primary w-full">
              {editingId ? "Update Doctor" : "Add Doctor"}
            </button>
          </form>
        </aside>

      </div>

    </div>

  );

}