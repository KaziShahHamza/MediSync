import { useEffect, useState } from "react";
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
      <div className="container py-10">
        Loading dashboard...
      </div>
    );

  }



  return (

    <div className="container py-8">


      {/* Greeting */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-slate-800">

          Good {time.getHours() < 12 ? "Morning" :
            time.getHours() < 18 ? "Afternoon" : "Evening"}

          {data.user?.name &&
            `, ${data.user.name}`}

        </h1>


        <p className="text-slate-500 mt-2">

          {time.toLocaleDateString()}

          {" | "}

          {time.toLocaleTimeString()}

        </p>

      </div>


      <div className="mb-8">

        <HealthSummaryCard
          summary={data.healthSummary}
        />

      </div>



      {/* Health */}

      <h2 className="text-2xl font-semibold mb-4">
        Health Overview
      </h2>


      <div className="grid md:grid-cols-3 gap-6">


        <HealthSummaryCard

          title="Blood Pressure"

          value={
            data.health.bloodPressure

              ? `${data.health.bloodPressure.high}/${data.health.bloodPressure.low}`
              : null
          }

          subtitle="Latest BP"

        />


        <HealthSummaryCard

          title="Blood Sugar"

          value={
            data.health.diabetes

              ? `${data.health.diabetes.glucose} mmol/L`
              : null
          }

          subtitle="Latest glucose level"

        />


        <HealthSummaryCard

          title="BMI"

          value={
            data.health.bmi

              ? data.health.bmi.value
              : null
          }

          subtitle="Latest BMI"

        />


      </div>




      {/* Statistics */}

      <h2 className="text-2xl font-semibold mt-10 mb-4">
        Summary
      </h2>


      <div className="grid md:grid-cols-3 gap-6">


        <StatCard

          title="Medicines"

          count={data.summary.medicines}

          linkText="View Medicines"

        />


        <StatCard

          title="Doctors"

          count={data.summary.doctors}

          linkText="View Doctors"

        />


        <StatCard

          title="Prescriptions"

          count={data.summary.prescriptions}

          linkText="View Prescriptions"

        />


      </div>





      {/* Quick Links */}

      <h2 className="text-2xl font-semibold mt-10 mb-4">
        Quick Access
      </h2>


      <div className="grid md:grid-cols-3 gap-6">


        <QuickLinkCard

          title="Medicines"

          description="Manage your medicines"

          path="/medicines"

        />


        <QuickLinkCard

          title="Health Charts"

          description="View health history"

          path="/health"

        />


        <QuickLinkCard

          title="Doctors"

          description="Manage your doctors"

          path="/doctors"

        />


        <QuickLinkCard

          title="Prescriptions"

          description="View medical documents"

          path="/prescriptions"

        />


        <QuickLinkCard

          title="Profile"

          description="Update personal information"

          path="/profile"

        />


      </div>


    </div>

  );

}