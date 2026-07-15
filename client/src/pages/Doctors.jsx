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


      <form
        onSubmit={saveDoctor}
        className="card p-6 space-y-6"
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

          <label>
            <input
              type="radio"
              name="designation"
              value="Professor"
              checked={form.designation==="Professor"}
              onChange={handleChange}
            />

            Professor
          </label>


          <label className="ml-5">
            <input
              type="radio"
              name="designation"
              value="Doctor"
              checked={form.designation==="Doctor"}
              onChange={handleChange}
            />

            Doctor
          </label>

        </div>



        <div>

          <p className="mb-2 font-medium">
            Specialty
          </p>


          <div className="grid md:grid-cols-2 gap-2">

            {specialties.map(item=>(

              <label key={item}>

                <input
                  type="radio"
                  checked={form.specialty===item}
                  onChange={()=>selectSpecialty(item)}
                />

                <span className="ml-2">
                  {item}
                </span>

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

          {hospitals.map(h=>(

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

          <div className="grid md:grid-cols-3">

          {days.map(day=>(

            <label key={day}>

              <input
                type="checkbox"
                checked={form.visitingDays.includes(day)}
                onChange={()=>toggleDay(day)}
              />

              <span className="ml-2">
                {day}
              </span>

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



        <button className="btn-primary">

          {editingId
            ? "Update Doctor"
            : "Add Doctor"}

        </button>


      </form>



      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">


        {doctors.map(doctor=>(

          <DoctorCard

            key={doctor._id}

            doctor={doctor}

            onEdit={editDoctor}

            onDelete={deleteDoctor}

          />

        ))}


      </div>


    </div>

  );

}