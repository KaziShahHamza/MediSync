import {
  Pill,
  Pencil,
  Trash2,
  Clock3,
  ImageOff,
} from "lucide-react";


export default function MedicineList({
  medicines,
  onEdit,
  onDelete,
}) {


  if (!medicines.length) {

    return (

      <div className="
        card
        text-center
        py-12
      ">


        <div className="
          w-16
          h-16
          rounded-2xl
          bg-blue-50
          flex
          items-center
          justify-center
          mx-auto
        ">


          <Pill
            size={32}
            className="text-blue-600"
          />


        </div>




        <h3 className="
          mt-5
          text-xl
          font-semibold
          text-slate-900
        ">

          No medicines added

        </h3>




        <p className="
          mt-2
          text-slate-500
        ">

          Add your medicines to manage dosage
          schedules and reminders.

        </p>


      </div>

    );

  }




  return (

    <div className="
      space-y-5
    ">


      {medicines.map((med)=>(


        <div
          key={med._id}
          className="
            card
          "
        >



          <div className="
            flex
            gap-5
            items-center
          ">



            {/* Medicine Image */}


            <div className="
              w-24
              h-24
              rounded-xl
              overflow-hidden
              border
              border-slate-200
              bg-slate-50
              flex
              items-center
              justify-center
              shrink-0
            ">


              {med.imageUrl ? (


                <img

                  src={med.imageUrl}

                  alt={med.name}

                  className="
                    w-full
                    h-full
                    object-cover
                  "

                  onError={(e)=>{

                    e.currentTarget.style.display="none";

                  }}

                />


              ) : (


                <ImageOff

                  size={28}

                  className="
                    text-slate-400
                  "

                />


              )}



            </div>






            {/* Medicine Details */}


            <div className="
              flex-1
            ">


              <h3 className="
                text-xl
                font-semibold
                text-slate-900
              ">

                {med.name}

              </h3>





              <div className="
                mt-3
                flex
                items-center
                gap-2
                text-sm
                text-slate-500
              ">


                <Clock3
                  size={16}
                />


                <span>

                  {med.dosageTimes
                    .map(
                      time =>
                      time.charAt(0).toUpperCase()
                      + time.slice(1)
                    )
                    .join(", ")}


                </span>


              </div>


            </div>





            {/* Actions */}


            <div className="
              flex
              flex-col
              gap-2
            ">


              <button

                onClick={() => onEdit(med)}

                className="
                  btn-secondary
                  px-3
                  py-2
                  text-sm
                "

              >


                <Pencil
                  size={16}
                />


                Edit


              </button>





              <button

                onClick={() => onDelete(med._id)}

                className="
                  btn-danger
                  px-3
                  py-2
                  text-sm
                "

              >


                <Trash2
                  size={16}
                />


                Delete


              </button>


            </div>



          </div>


        </div>


      ))}


    </div>


  );

}