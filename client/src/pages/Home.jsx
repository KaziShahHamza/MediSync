// src/pages/Home.jsx

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function Home() {

  const { user } = useAuth();


  return (

    <div className="bg-white">


      {/* Hero Section */}

      <section className="container py-20 grid md:grid-cols-2 gap-12 items-center">


        <div>

          <h1 className="text-5xl font-bold text-slate-800 leading-tight">

            Your Personal

            <span className="text-sky-600">
              {" "}Health Management{" "}
            </span>

            Platform

          </h1>



          <p className="mt-6 text-lg text-slate-600 leading-relaxed">

            MediSync helps you organize medicines, track health
            records, manage doctors, store prescriptions, and
            understand your health progress from one place.

          </p>



          <div className="mt-8 flex gap-4">


            {!user && (

              <>

                <Link
                  to="/signup"
                  className="btn-primary"
                >
                  Get Started
                </Link>


                <Link
                  to="/login"
                  className="px-6 py-3 border border-sky-600 text-sky-600 rounded-lg hover:bg-sky-50"
                >
                  Login
                </Link>


              </>

            )}



            {user && (

              <Link
                to="/dashboard"
                className="btn-primary"
              >
                Go To Dashboard
              </Link>

            )}


          </div>


        </div>




        <div className="card p-8">


          <h2 className="text-2xl font-semibold text-slate-700">

            Complete Health Overview

          </h2>



          <div className="mt-6 space-y-4">


            <div className="p-4 bg-slate-50 rounded-lg">

              Blood Pressure Tracking

            </div>


            <div className="p-4 bg-slate-50 rounded-lg">

              Medicine Reminders

            </div>


            <div className="p-4 bg-slate-50 rounded-lg">

              Doctor & Prescription Management

            </div>


            <div className="p-4 bg-slate-50 rounded-lg">

              Health Trend Monitoring

            </div>


          </div>


        </div>


      </section>





      {/* Features */}

      <section className="container py-16">


        <h2 className="text-3xl font-bold text-center text-slate-800">

          Everything You Need For Better Health Management

        </h2>



        <div className="grid md:grid-cols-3 gap-6 mt-10">



          {[
            {
              title:"Medicine Management",
              text:"Store medicines, manage dosage schedules, and receive reminders."
            },

            {
              title:"Health Tracking",
              text:"Monitor BMI, blood pressure, and diabetes records with charts."
            },

            {
              title:"Medical Records",
              text:"Keep prescriptions and important health documents organized."
            },

            {
              title:"Doctor Management",
              text:"Save doctors, hospitals, chambers, and visiting information."
            },

            {
              title:"Health Insights",
              text:"Understand your health status through personalized summaries."
            },

            {
              title:"Secure Records",
              text:"Your personal health information stays connected to your account."
            },

          ].map((feature)=>(


            <div
              key={feature.title}
              className="card p-6"
            >

              <h3 className="text-xl font-semibold text-sky-600">

                {feature.title}

              </h3>


              <p className="mt-3 text-slate-600">

                {feature.text}

              </p>


            </div>


          ))}



        </div>


      </section>






      {/* How It Works */}

      <section className="bg-slate-50 py-16">


        <div className="container">


          <h2 className="text-3xl font-bold text-center text-slate-800">

            How MediSync Works

          </h2>



          <div className="grid md:grid-cols-3 gap-8 mt-10">


            <div className="card p-6">

              <h3 className="font-semibold text-xl">

                1. Create Account

              </h3>

              <p className="mt-3 text-slate-600">

                Register and create your personal health profile.

              </p>

            </div>



            <div className="card p-6">

              <h3 className="font-semibold text-xl">

                2. Add Health Data

              </h3>

              <p className="mt-3 text-slate-600">

                Add medicines, doctors, prescriptions, and health records.

              </p>

            </div>



            <div className="card p-6">

              <h3 className="font-semibold text-xl">

                3. Track Progress

              </h3>

              <p className="mt-3 text-slate-600">

                View your dashboard and understand your health journey.

              </p>

            </div>


          </div>


        </div>


      </section>







      {/* Health Monitoring */}

      <section className="container py-16">


        <div className="grid md:grid-cols-2 gap-10">


          <div>

            <h2 className="text-3xl font-bold text-slate-800">

              Monitor Your Health Trends

            </h2>


            <p className="mt-5 text-slate-600 leading-relaxed">

              Track important health indicators like blood pressure,
              blood sugar, and BMI over time. Keeping historical
              records helps you and your doctor make better decisions.

            </p>


          </div>




          <div className="card p-6 space-y-4">


            <div className="p-4 bg-slate-50 rounded">

              BMI Progress

            </div>


            <div className="p-4 bg-slate-50 rounded">

              Blood Pressure History

            </div>


            <div className="p-4 bg-slate-50 rounded">

              Diabetes Monitoring

            </div>


          </div>


        </div>


      </section>







      {/* Privacy */}

      <section className="bg-sky-50 py-16">


        <div className="container text-center">


          <h2 className="text-3xl font-bold text-slate-800">

            Your Health Data, Organized Securely

          </h2>


          <p className="mt-4 text-slate-600 max-w-3xl mx-auto">

            MediSync keeps your medical information organized in one
            place. Manage your records, doctors, medicines, and health
            information whenever you need them.

          </p>


        </div>


      </section>







      {/* CTA */}

      {!user && (

        <section className="container py-20 text-center">


          <h2 className="text-4xl font-bold text-slate-800">

            Start Managing Your Health Today

          </h2>


          <p className="mt-4 text-slate-600">

            Create your free MediSync account and keep your health
            information organized.

          </p>



          <Link

            to="/signup"

            className="btn-primary inline-block mt-8"

          >

            Create Account

          </Link>


        </section>

      )}



    </div>

  );

}