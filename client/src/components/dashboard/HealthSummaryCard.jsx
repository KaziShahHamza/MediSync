import {
  HeartPulse,
} from "lucide-react";


export default function HealthSummaryCard({
  title,
  value,
  subtitle,
  summary,
  icon: Icon = HeartPulse,
}) {


  return (

    <div className="card">


      {summary ? (

        <>


          <div className="
            flex
            items-center
            gap-3
            mb-5
          ">


            <div className="icon-wrapper">

              <HeartPulse
                size={22}
                className="text-blue-600"
              />

            </div>



            <h3 className="card-title">

              Health Summary

            </h3>


          </div>




          <p className="
            text-slate-600
            leading-relaxed
          ">

            {summary}

          </p>



          <p className="
            text-xs
            text-slate-400
            mt-5
          ">

            Based on your latest health records

          </p>


        </>


      ) : (


        <>


          <div className="
            flex
            items-start
            justify-between
          ">


            <div>


              <h3 className="
                text-sm
                font-medium
                text-slate-500
              ">

                {title}

              </h3>



              <p className="
                text-3xl
                font-bold
                text-slate-900
                mt-3
              ">

                {value || "No data"}

              </p>


            </div>




            <div className="icon-wrapper">


              <Icon
                size={22}
                className="text-blue-600"
              />


            </div>


          </div>



          {subtitle && (

            <p className="
              mt-4
              text-sm
              text-slate-500
            ">

              {subtitle}

            </p>

          )}


        </>

      )}


    </div>

  );

}