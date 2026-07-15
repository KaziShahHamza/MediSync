import {
  ArrowRight,

} from "lucide-react";


export default function StatCard({
  title,
  count,
  linkText,
  onClick,
  icon: Icon,
}) {


  return (

    <div className="card">


      <div className="
        flex
        items-start
        justify-between
      ">


        <div>


          <p className="
            text-sm
            font-medium
            text-slate-500
          ">

            {title}

          </p>



          <p className="
            text-4xl
            font-bold
            text-slate-900
            mt-3
          ">

            {count}

          </p>


        </div>



        {Icon && (

          <div className="icon-wrapper">

            <Icon
              size={22}
              className="text-blue-600"
            />

          </div>

        )}


      </div>




      <button

        onClick={onClick}

        className="
          mt-6
          inline-flex
          items-center
          gap-2
          text-sm
          font-medium
          text-blue-600
          hover:text-blue-700
          transition
          duration-150
        "

      >

        {linkText || "View"}


        <ArrowRight
          size={16}
        />


      </button>


    </div>

  );

}