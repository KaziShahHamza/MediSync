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
  TrendingUp,
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





export default function BMIChart({
  logs,
}) {



  const bmiLogs =
    logs
      .filter(
        (log)=>log.type==="bmi"
      );





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


        <TrendingUp

          size={22}

          className="text-blue-600"

        />


        <h3 className="card-title">

          BMI History

        </h3>


      </div>






      {bmiLogs.length === 0 ? (



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

            No BMI records available yet.

          </p>


        </div>



      ) : (


        <Line

          data={{

            labels:
              bmiLogs.map(
                (log)=>
                new Date(
                  log.createdAt
                )
                .toLocaleDateString()
              ),


            datasets:[

              {

                label:"BMI",

                data:
                  bmiLogs.map(
                    (log)=>
                    log.bmi
                  ),


                borderColor:"#2563EB",

                backgroundColor:"#2563EB33",

                tension:0.3,


              },


            ],


          }}

        />


      )}


    </div>


  );

}