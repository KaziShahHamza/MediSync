import { Link } from "react-router-dom";
import {
  ArrowRight,
} from "lucide-react";


export default function QuickLinkCard({
  title,
  description,
  path,
  icon: Icon,
}) {


  return (

    <Link
      to={path}
      className="
        card
        group
      "
    >


      <div className="
        flex
        items-start
        justify-between
      ">


        {Icon && (

          <div className="icon-wrapper">


            <Icon
              size={22}
              className="
                text-blue-600
                transition-colors
                duration-150
              "
            />


          </div>

        )}




        <ArrowRight
          size={18}
          className="
            text-slate-400
            group-hover:text-blue-600
            transition-colors
            duration-150
          "
        />


      </div>





      <h3 className="
        mt-6
        text-lg
        font-semibold
        text-slate-900
        group-hover:text-blue-600
        transition-colors
        duration-150
      ">

        {title}

      </h3>




      <p className="
        mt-2
        text-sm
        text-slate-500
      ">

        {description}

      </p>


    </Link>

  );

}