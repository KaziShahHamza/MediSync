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

  <div className="container page">


    {/* Header */}

    <section className="mb-10">


      <h1 className="page-title">

        My Doctors

      </h1>


      <p className="
        mt-3
        text-slate-600
      ">

        Manage your healthcare providers,
        hospitals, and appointment information.

      </p>


    </section>





    <div className="
      grid
      lg:grid-cols-[1fr_420px]
      gap-8
      items-start
    ">




      {/* Doctor List */}


      <section>


        <div className="
          flex
          items-center
          justify-between
          mb-5
        ">



          <div>


            <h2 className="section-title">

              Doctor Records

            </h2>



            <p className="
              text-sm
              text-slate-500
              mt-1
            ">


              {doctors.length}

              {" "}

              doctor
              {doctors.length === 1 ? "" : "s"}

              saved


            </p>


          </div>


        </div>






        {doctors.length ? (


          <div className="
            space-y-6
          ">


            {doctors.map((doctor)=>(


              <DoctorCard

                key={doctor._id}

                doctor={doctor}

                onEdit={editDoctor}

                onDelete={deleteDoctor}

              />


            ))}


          </div>



        ) : (


          <div className="
            card
            py-14
            text-center
          ">


            <h3 className="
              text-xl
              font-semibold
              text-slate-800
            ">

              No doctors added

            </h3>



            <p className="
              mt-2
              text-slate-500
            ">

              Add your doctors to keep
              healthcare contacts organized.

            </p>


          </div>


        )}



      </section>






      {/* Doctor Form */}


      <aside className="
        card
        sticky
        top-24
      ">



        <div className="mb-6">


          <h2 className="card-title">

            {editingId
              ? "Update Doctor"
              : "Add Doctor"
            }


          </h2>



          <p className="
            text-sm
            text-slate-500
            mt-1
          ">

            Store doctor details and visiting information.

          </p>


        </div>





        <form

          onSubmit={saveDoctor}

          className="
            space-y-5
          "

        >


          {/* Doctor Name */}

          <div>

            <label>
              Doctor Name
            </label>


            <input

              name="name"

              placeholder="Enter doctor name"

              value={form.name}

              onChange={handleChange}

              className="input"

            />

          </div>







          {/* Designation */}


          <div>


            <label>

              Designation

            </label>



            <div className="
              grid
              gap-2
            ">


              {designations.map((designation)=>(


                <label

                  key={designation}

                  className={`
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    px-4
                    py-3
                    cursor-pointer
                    transition
                    duration-150
                    ${
                      form.designation === designation

                      ? "border-blue-600 bg-blue-50 text-blue-600"

                      : "border-slate-200 hover:border-blue-300"
                    }
                  `}

                >



                  <input

                    type="radio"

                    name="designation"

                    value={designation}

                    checked={
                      form.designation === designation
                    }

                    onChange={handleChange}

                  />



                  <span className="text-sm font-medium">

                    {designation}

                  </span>


                </label>


              ))}


            </div>


          </div>







          {/* Specialty */}



          <div>


            <label>

              Specialty

            </label>




            <div className="
              grid
              md:grid-cols-2
              gap-2
            ">



              {specialties.map((item)=>(


                <label

                  key={item}

                  className={`
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    border
                    px-3
                    py-2.5
                    cursor-pointer
                    transition
                    duration-150
                    ${
                      form.specialty === item

                      ? "border-blue-600 bg-blue-50 text-blue-600"

                      : "border-slate-200 hover:border-blue-300"
                    }
                  `}

                >


                  <input

                    type="radio"

                    checked={
                      form.specialty === item
                    }

                    onChange={() =>
                      selectSpecialty(item)
                    }

                  />


                  <span className="text-sm">

                    {item}

                  </span>


                </label>


              ))}



            </div>


          </div>








          {/* Hospital */}



          <div>


            <label>

              Hospital

            </label>



            <select

              name="hospital"

              value={form.hospital}

              onChange={handleChange}

              className="input"

            >


              <option value="">

                Select Hospital

              </option>



              {hospitals.map((hospital)=>(


                <option key={hospital}>

                  {hospital}

                </option>


              ))}


            </select>


          </div>








          {/* Chamber */}



          <div>


            <label>

              Chamber Address

            </label>


            <input

              name="chamber"

              placeholder="Doctor chamber location"

              value={form.chamber}

              onChange={handleChange}

              className="input"

            />


          </div>








          {/* Visiting Days */}



          <div>


            <label>

              Visiting Days

            </label>



            <div className="
              grid
              grid-cols-3
              gap-2
            ">


              {days.map((day)=>(


                <label

                  key={day}

                  className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-slate-600
                  "

                >


                  <input

                    type="checkbox"

                    checked={
                      form.visitingDays.includes(day)
                    }

                    onChange={() =>
                      toggleDay(day)
                    }

                  />


                  {day}


                </label>


              ))}


            </div>


          </div>








          {/* Visiting Time */}



          <div>


            <label>

              Visiting Time

            </label>



            <input

              name="visitingTime"

              placeholder="Example: 6 PM - 9 PM"

              value={form.visitingTime}

              onChange={handleChange}

              className="input"

            />


          </div>








          {/* Phone */}



          <div>


            <label>

              Phone Number

            </label>



            <input

              name="phone"

              placeholder="Doctor phone number"

              value={form.phone}

              onChange={handleChange}

              className="input"

            />


          </div>








          {/* Notes */}



          <div>


            <label>

              Notes

            </label>


            <textarea

              name="notes"

              placeholder="Additional notes"

              value={form.notes}

              onChange={handleChange}

              className="
                input
                min-h-24
              "

            />


          </div>








          <button

            className="
              btn-primary
              w-full
            "

          >

            {editingId
              ? "Update Doctor"
              : "Add Doctor"
            }


          </button>


        </form>


      </aside>



    </div>


  </div>

);

}