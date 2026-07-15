import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from "chart.js";

import { Line } from "react-chartjs-2";

import {
  Droplets,
  Activity,
} from "lucide-react";




ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);





export default function BloodSugarChart({
  logs,
}) {



  const sugarLogs =
    logs
      .filter(
        (log)=>log.type==="diabetes"
      )
      .slice(-7);






  return (

    <div className="
      card
      min-h-[380px]
    ">



      <div className="
        flex
        items-center
        gap-3
        mb-6
      ">



        <Droplets

          size={22}

          className="text-blue-600"

        />



        <h3 className="card-title">

          Blood Sugar History

        </h3>


      </div>







      {sugarLogs.length===0 ? (



        <div className="
          h-72
          flex
          flex-col
          items-center
          justify-center
          text-center
        ">


          <Activity

            size={40}

            className="text-slate-300"

          />



          <p className="
            mt-4
            text-slate-500
          ">

            No blood sugar records available.

          </p>


        </div>



      ) : (



        <Line

          data={{


            labels:
              sugarLogs.map(
                (log)=>
                new Date(
                  log.createdAt
                )
                .toLocaleDateString()
              ),



            datasets:[


              {

                label:"Blood Glucose",

                data:
                  sugarLogs.map(
                    (log)=>
                    log.glucose
                  ),


                borderColor:"#2563EB",

                backgroundColor:"#2563EB33",


              },


            ],


          }}



        />



      )}



    </div>


  );

}