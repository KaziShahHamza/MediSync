import { useEffect, useState } from "react";
import {
  Activity,
  Droplets,
  HeartPulse,
  Pill,
  Stethoscope,
  FileImage,
  UserRound,
  CalendarClock,
} from "lucide-react";

import HealthSummaryCard from "../components/dashboard/HealthSummaryCard";
import StatCard from "../components/dashboard/StatCard";
import QuickLinkCard from "../components/dashboard/QuickLinkCard";


export default function Dashboard() {

  const [data, setData] = useState(null);

  const [time, setTime] = useState(new Date());



  useEffect(() => {

    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/dashboard", {

      headers: {

        Authorization: `Bearer ${token}`,

      },

    })

      .then(res => res.json())

      .then(result => setData(result));


  }, []);




  useEffect(() => {

    const timer = setInterval(() => {

      setTime(new Date());

    }, 1000);



    return () => clearInterval(timer);


  }, []);





  if (!data) {

    return (

      <div className="container page">

        <div className="grid gap-6 md:grid-cols-3">

          <div className="skeleton-card h-32" />
          <div className="skeleton-card h-32" />
          <div className="skeleton-card h-32" />

        </div>


      </div>

    );

  }





  const greeting =
    time.getHours() < 12
      ? "Morning"
      : time.getHours() < 18
        ? "Afternoon"
        : "Evening";





  return (

    <div className="container page">



      {/* Header */}


      <section className="page-header">


        <div className="
          flex
          items-center
          justify-between
          gap-4
          flex-wrap
        ">


          <div>


            <h1 className="page-title">

              Good {greeting}
              {data.user?.name &&
                `, ${data.user.name}`}

            </h1>



            <p className="page-description">

              Monitor your health activity and manage your
              healthcare information from one place.

            </p>


          </div>




          <div className="
            surface
            px-4
            py-3
            flex
            items-center
            gap-3
          ">


            <CalendarClock
              size={20}
              className="text-blue-600"
            />


            <div>

              <p className="
                text-sm
                font-medium
                text-slate-700
              ">

                {time.toLocaleDateString()}

              </p>


              <p className="
                text-xs
                text-slate-500
              ">

                {time.toLocaleTimeString()}

              </p>


            </div>


          </div>


        </div>


      </section>






      {/* AI / Health Summary */}


      <section className="section">


        <HealthSummaryCard
          summary={data.healthSummary}
        />


      </section>





      {/* Health Overview */}


      <section className="section">


        <div className="section-header">


          <h2 className="section-title">

            Health Overview

          </h2>


        </div>




        <div className="grid md:grid-cols-3 gap-6">


          <HealthSummaryCard

            title="Blood Pressure"

            value={
              data.health.bloodPressure
                ? `${data.health.bloodPressure.high}/${data.health.bloodPressure.low}`
                : null
            }

            subtitle="Latest reading"

            icon={HeartPulse}

          />



          <HealthSummaryCard

            title="Blood Sugar"

            value={
              data.health.diabetes
                ? `${data.health.diabetes.glucose} mmol/L`
                : null
            }

            subtitle="Latest glucose level"

            icon={Droplets}

          />



          <HealthSummaryCard

            title="BMI"

            value={
              data.health.bmi
                ? data.health.bmi.value
                : null
            }

            subtitle="Latest BMI"

            icon={Activity}

          />


        </div>


      </section>

            {/* ================= SUMMARY STATISTICS ================= */}


      <section className="section">


        <div className="section-header">


          <h2 className="section-title">

            Health Records Summary

          </h2>


        </div>




        <div className="
          grid
          md:grid-cols-3
          gap-6
        ">


          <StatCard

            title="Medicines"

            count={data.summary.medicines}

            linkText="View Medicines"

            icon={Pill}

          />



          <StatCard

            title="Doctors"

            count={data.summary.doctors}

            linkText="View Doctors"

            icon={Stethoscope}

          />



          <StatCard

            title="Prescriptions"

            count={data.summary.prescriptions}

            linkText="View Prescriptions"

            icon={FileImage}

          />


        </div>


      </section>






      {/* ================= QUICK ACTIONS ================= */}



      <section className="section">


        <div className="section-header">


          <h2 className="section-title">

            Quick Actions

          </h2>


        </div>





        <div className="
          grid
          md:grid-cols-2
          xl:grid-cols-3
          gap-6
        ">


          <QuickLinkCard

            title="Medicines"

            description="Manage medicines and dosage schedules"

            path="/medicines"

            icon={Pill}

          />



          <QuickLinkCard

            title="Health Charts"

            description="Review health history and trends"

            path="/health"

            icon={Activity}

          />



          <QuickLinkCard

            title="Doctors"

            description="Manage your healthcare providers"

            path="/doctors"

            icon={Stethoscope}

          />



          <QuickLinkCard

            title="Prescriptions"

            description="View uploaded medical records"

            path="/prescriptions"

            icon={FileImage}

          />



          <QuickLinkCard

            title="Profile"

            description="Update personal health information"

            path="/profile"

            icon={UserRound}

          />


        </div>


      </section>



    </div>

  );

}