import {
  Eye,
  Trash2,
  CalendarDays,
} from "lucide-react";


export default function PrescriptionCard({

  prescription,

  onOpen,

  onDelete,

}) {


  return (

    <div className="
      card
      overflow-hidden
      p-0
    ">


      {/* Image */}


      <div

        className="
          relative
          h-52
          bg-slate-100
          cursor-pointer
        "

        onClick={() => onOpen(prescription)}

      >


        <img

          src={prescription.imageUrl}

          alt={prescription.title}

          className="
            w-full
            h-full
            object-cover
          "

        />



        <div className="
          absolute
          inset-0
          bg-slate-900/0
          hover:bg-slate-900/20
          transition
          duration-150
          flex
          items-center
          justify-center
        ">


          <Eye

            size={30}

            className="
              text-white
              opacity-0
              hover:opacity-100
              transition
            "

          />


        </div>



      </div>







      {/* Content */}



      <div className="p-5">


        <h3 className="
          font-semibold
          text-slate-900
          truncate
        ">


          {prescription.title}


        </h3>




        <div className="
          flex
          items-center
          gap-2
          mt-2
          text-sm
          text-slate-500
        ">


          <CalendarDays size={16}/>



          {new Date(
            prescription.createdAt
          ).toLocaleDateString()}



        </div>






        <button

          onClick={() =>
            onDelete(prescription._id)
          }


          className="
            mt-5
            inline-flex
            items-center
            justify-center
            gap-2
            w-full
            rounded-xl
            border
            border-red-200
            text-red-600
            py-2.5
            font-medium
            transition
            duration-150
            hover:bg-red-50
          "

        >


          <Trash2 size={17}/>


          Delete


        </button>



      </div>



    </div>


  );

}