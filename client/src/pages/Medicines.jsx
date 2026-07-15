import { useEffect, useState } from "react";
import {
  Pill,
  PlusCircle,
} from "lucide-react";

import MedicineForm from "../components/MedicineForm";
import MedicineList from "../components/MedicineList";


export default function Dashboard() {


  const [meds, setMeds] = useState([]);

  const [editing, setEditing] = useState(null);

  const token = localStorage.getItem("token");



  const fetchMeds = async () => {

    const res = await fetch(
      "http://localhost:5000/api/medicines",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );


    setMeds(await res.json());

  };




  useEffect(() => {

    fetchMeds();

  }, []);





  const saveMedicine = async (data) => {


    if (editing) {


      await fetch(
        `http://localhost:5000/api/medicines/${editing._id}`,
        {

          method: "PUT",

          headers: {

            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`

          },

          body: JSON.stringify(data)

        }
      );


      setEditing(null);


    } else {


      await fetch(
        "http://localhost:5000/api/medicines",
        {

          method: "POST",

          headers: {

            "Content-Type": "application/json",

            Authorization: `Bearer ${token}`

          },

          body: JSON.stringify(data)

        }
      );


    }


    fetchMeds();


  };





  const deleteMedicine = async (id) => {


    await fetch(
      `http://localhost:5000/api/medicines/${id}`,
      {

        method: "DELETE",

        headers: {

          Authorization: `Bearer ${token}`

        }

      }
    );


    fetchMeds();


  };





  return (

    <div className="container page">



      {/* Header */}


      <section className="page-header">


        <div>


          <div className="
            flex
            items-center
            gap-3
          ">


            <div className="icon-wrapper">


              <Pill
                size={24}
                className="text-blue-600"
              />


            </div>



            <h1 className="page-title">

              Medicines

            </h1>


          </div>




          <p className="
            mt-3
            text-slate-600
          ">

            Manage your medications, dosage schedules,
            and treatment information.

          </p>


        </div>



      </section>






      {/* Content */}


      <section className="
        grid
        lg:grid-cols-2
        gap-8
        items-start
      ">



        {/* Medicine List */}


        <div>


          <div className="
            flex
            items-center
            justify-between
            mb-5
          ">


            <h2 className="section-title">

              Your Medicines

            </h2>



            <span className="badge">

              {meds.length} Total

            </span>


          </div>



          <MedicineList

            medicines={meds}

            onEdit={setEditing}

            onDelete={deleteMedicine}

          />


        </div>





        {/* Form */}


        <div>


          <div className="
            flex
            items-center
            gap-2
            mb-5
          ">


            <PlusCircle
              size={22}
              className="text-blue-600"
            />


            <h2 className="section-title">

              {editing
                ? "Edit Medicine"
                : "Add Medicine"}

            </h2>


          </div>



          <MedicineForm

            onSave={saveMedicine}

            editing={editing}

          />


        </div>


      </section>



    </div>

  );

}