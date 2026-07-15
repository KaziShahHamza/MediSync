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
  HeartPulse,
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






export default function BloodPressureChart({
  logs,
}) {



  const bpLogs =
    logs
      .filter(
        (log)=>log.type==="bp"
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


        <HeartPulse

          size={22}

          className="text-blue-600"

        />



        <h3 className="card-title">

          Blood Pressure History

        </h3>


      </div>







      {bpLogs.length===0 ? (



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

            No blood pressure records available.

          </p>


        </div>



      ) : (



        <Line

          data={{


            labels:
              bpLogs.map(
                (log)=>
                new Date(
                  log.createdAt
                )
                .toLocaleDateString()
              ),



            datasets:[


              {

                label:"Systolic",

                data:
                  bpLogs.map(
                    (log)=>
                    log.High
                  ),


                borderColor:"#2563EB",

                backgroundColor:"#2563EB33",


              },



              {

                label:"Diastolic",

                data:
                  bpLogs.map(
                    (log)=>
                    log.Low
                  ),


                borderColor:"#DC2626",

                backgroundColor:"#DC262633",


              },


            ],



          }}



        />


      )}



    </div>


  );

}