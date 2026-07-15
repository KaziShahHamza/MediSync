import {
  Activity,
  HeartPulse,
  Droplets,
  Scale,
} from "lucide-react";

import useHealthLogs from "../hooks/useHealthLogs";

import BMIForm from "../components/BMIForm";
import BMIChart from "../components/BMIChart";

import BloodPressureForm from "../components/BloodPressureForm";
import BloodPressureChart from "../components/BloodPressureChart";

import BloodSugarForm from "../components/BloodSugarForm";
import BloodSugarChart from "../components/BloodSugarChart";



export default function Health() {


  const {
    logs,
    addLog,
  } = useHealthLogs();





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

              <HeartPulse
                size={24}
                className="text-blue-600"
              />

            </div>



            <h1 className="page-title">

              Health Report

            </h1>


          </div>




          <p className="
            mt-3
            text-slate-600
          ">

            Track your health metrics, review trends,
            and maintain your personal health history.

          </p>


        </div>


      </section>






      {/* Health Metrics */}


      <section className="space-y-12">





        {/* Blood Pressure */}


        <div>


          <div className="
            flex
            items-center
            gap-3
            mb-5
          ">


            <HeartPulse
              size={22}
              className="text-blue-600"
            />


            <h2 className="section-title">

              Blood Pressure

            </h2>


          </div>




          <div className="
            grid
            lg:grid-cols-[360px_1fr]
            gap-6
          ">


            <BloodPressureForm

              onAdd={addLog}

            />



            <BloodPressureChart

              logs={logs}

            />


          </div>


        </div>






        {/* Blood Sugar */}


        <div>


          <div className="
            flex
            items-center
            gap-3
            mb-5
          ">


            <Droplets
              size={22}
              className="text-blue-600"
            />


            <h2 className="section-title">

              Blood Sugar

            </h2>


          </div>





          <div className="
            grid
            lg:grid-cols-[360px_1fr]
            gap-6
          ">


            <BloodSugarForm

              onAdd={addLog}

            />



            <BloodSugarChart

              logs={logs}

            />


          </div>


        </div>







        {/* BMI */}



        <div>


          <div className="
            flex
            items-center
            gap-3
            mb-5
          ">


            <Scale
              size={22}
              className="text-blue-600"
            />


            <h2 className="section-title">

              BMI Tracking

            </h2>


          </div>





          <div className="
            grid
            lg:grid-cols-[360px_1fr]
            gap-6
          ">



            <BMIForm

              onAdd={addLog}

            />



            <BMIChart

              logs={logs}

            />


          </div>


        </div>






      </section>



    </div>


  );

}