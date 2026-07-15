import {
  Pencil,
  Trash2,
  Building2,
  Phone,
  Clock,
  Stethoscope,
} from "lucide-react";



export default function DoctorCard({
  doctor,
  onEdit,
  onDelete,
}) {


  return (

    <div className="card">


      {/* Header */}


      <div className="
        flex
        justify-between
        gap-4
      ">


        <div>


          <h3 className="
            text-xl
            font-semibold
            text-slate-900
          ">

            {doctor.name}

          </h3>


          <p className="
            mt-1
            text-blue-600
            font-medium
          ">

            {doctor.designation || "Doctor"}

          </p>


        </div>




        <span className="
          h-fit
          rounded-full
          bg-blue-50
          px-3
          py-1
          text-sm
          text-blue-600
          font-medium
        ">


          {doctor.specialty || "Specialist"}


        </span>



      </div>







      {/* Details */}



      <div className="
        mt-6
        grid
        gap-4
      ">



        <Info

          icon={<Building2 size={18}/>}

          label="Hospital"

          value={doctor.hospital}

        />



        <Info

          icon={<Stethoscope size={18}/>}

          label="Chamber"

          value={doctor.chamber}

        />



        <Info

          icon={<Phone size={18}/>}

          label="Phone"

          value={doctor.phone}

        />



        <Info

          icon={<Clock size={18}/>}

          label="Visiting"

          value={
            `${doctor.visitingDays?.join(", ") || "-"} ${
              doctor.visitingTime || ""
            }`
          }

        />


      </div>






      {doctor.notes && (

        <div className="
          mt-5
          rounded-xl
          bg-slate-50
          p-4
          text-sm
          text-slate-600
        ">

          {doctor.notes}

        </div>

      )}






      {/* Actions */}



      <div className="
        mt-6
        flex
        gap-3
      ">


        <button

          onClick={() => onEdit(doctor)}

          className="
            btn-secondary
            flex-1
          "

        >

          <Pencil size={16}/>

          Edit

        </button>





        <button

          onClick={() => onDelete(doctor._id)}

          className="
            btn-danger
            flex-1
          "

        >

          <Trash2 size={16}/>

          Delete

        </button>


      </div>



    </div>

  );

}







function Info({
  icon,
  label,
  value,
}) {


  return (

    <div className="
      flex
      gap-3
      rounded-xl
      bg-slate-50
      p-3
    ">


      <div className="
        text-blue-600
        mt-1
      ">

        {icon}

      </div>



      <div>


        <p className="
          text-xs
          text-slate-500
        ">

          {label}

        </p>


        <p className="
          mt-1
          font-medium
          text-slate-800
        ">

          {value || "-"}

        </p>


      </div>


    </div>

  );

}