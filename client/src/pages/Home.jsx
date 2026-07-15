import { Link } from "react-router-dom";
import {
  Pill,
  HeartPulse,
  FileText,
  Stethoscope,
  Brain,
  ShieldCheck,
  Activity,
  Droplets,
  Scale,
  UserPlus,
  ClipboardPlus,
  TrendingUp,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";


export default function Home() {

  const { user } = useAuth();


  const features = [
    {
      title: "Medicine Management",
      text: "Store medicines, manage dosage schedules, and keep your treatment plan organized.",
      icon: Pill,
    },
    {
      title: "Health Tracking",
      text: "Monitor BMI, blood pressure, and blood sugar with clear health trends.",
      icon: HeartPulse,
    },
    {
      title: "Medical Records",
      text: "Keep prescriptions and important medical information organized securely.",
      icon: FileText,
    },
    {
      title: "Doctor Management",
      text: "Manage doctors, hospitals, specialties, and important contact details.",
      icon: Stethoscope,
    },
    {
      title: "Health Insights",
      text: "Understand your health progress with personalized summaries.",
      icon: Brain,
    },
    {
      title: "Secure Records",
      text: "Your health information stays private and connected to your account.",
      icon: ShieldCheck,
    },
  ];


  return (

    <div className="bg-white">


      {/* ================= HERO ================= */}

      <section className="container page">

        <div className="grid lg:grid-cols-2 gap-12 items-center">


          <div>


            <p className="
              inline-flex
              items-center
              gap-2
              text-sm
              font-medium
              text-blue-600
              bg-blue-50
              px-4
              py-2
              rounded-full
            ">
              <HeartPulse size={16} />

              Personal Healthcare Platform
            </p>



            <h1 className="
              mt-6
              text-5xl
              lg:text-6xl
              font-bold
              tracking-tight
              text-slate-900
              leading-tight
            ">

              Manage your health
              <span className="text-blue-600">
                {" "}with confidence
              </span>

            </h1>



            <p className="
              mt-6
              text-lg
              text-slate-600
              max-w-xl
            ">

              MediSync helps you manage medicines, track health
              records, organize doctors, and keep your medical
              information available in one secure platform.

            </p>




            <div className="mt-8 flex flex-wrap gap-4">


              {!user && (

                <>

                  <Link
                    to="/signup"
                    className="btn-primary"
                  >
                    Create Account
                  </Link>


                  <Link
                    to="/login"
                    className="btn-secondary"
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




          {/* Future Image Placeholder */}

          <div className="
            card
            min-h-[420px]
            flex
            items-center
            justify-center
            bg-slate-50
          ">


            <div className="text-center">


              <div className="
                w-20
                h-20
                rounded-2xl
                bg-blue-100
                flex
                items-center
                justify-center
                mx-auto
                mb-6
              ">

                <HeartPulse
                  size={42}
                  className="text-blue-600"
                />

              </div>



              <h3 className="
                text-xl
                font-semibold
                text-slate-900
              ">

                Complete Health Overview

              </h3>


              <p className="
                mt-2
                text-slate-500
                max-w-sm
              ">

                A centralized place for your medicines,
                health records, and medical information.

              </p>


            </div>


          </div>



        </div>

      </section>





      {/* ================= FEATURES ================= */}


      <section className="container section">


        <div className="text-center max-w-3xl mx-auto">


          <h2 className="page-title">

            Everything you need for better health management

          </h2>


          <p className="
            mt-4
            text-slate-600
          ">

            Organize your healthcare journey with powerful
            tools designed around your personal medical needs.

          </p>


        </div>




        <div className="
          mt-10
          grid
          md:grid-cols-2
          xl:grid-cols-3
          gap-6
        ">


          {features.map((feature)=>{


            const Icon = feature.icon;


            return (

              <div
                key={feature.title}
                className="card"
              >

                <div className="
                  icon-wrapper
                  mb-5
                ">

                  <Icon
                    size={22}
                    className="text-blue-600"
                  />

                </div>



                <h3 className="card-title">

                  {feature.title}

                </h3>


                <p className="
                  mt-3
                  text-slate-600
                ">

                  {feature.text}

                </p>


              </div>

            );

          })}


        </div>


      </section>


      {/* ================= HOW IT WORKS ================= */}


      <section className="
        bg-slate-50
        py-16
      ">


        <div className="container">


          <div className="text-center">


            <h2 className="page-title">

              How MediSync works

            </h2>


            <p className="
              mt-4
              text-slate-600
              max-w-2xl
              mx-auto
            ">

              Start organizing your health information in a few
              simple steps.

            </p>


          </div>




          <div className="
            mt-10
            grid
            md:grid-cols-3
            gap-6
          ">


            {[
              {
                number: "01",
                title: "Create Account",
                text: "Register and create your personal health profile.",
                icon: UserPlus,
              },
              {
                number: "02",
                title: "Add Health Data",
                text: "Manage medicines, doctors, prescriptions, and health records.",
                icon: ClipboardPlus,
              },
              {
                number: "03",
                title: "Track Progress",
                text: "Monitor your health journey through organized insights.",
                icon: TrendingUp,
              },
            ].map((step)=>{


              const Icon = step.icon;


              return (

                <div
                  key={step.title}
                  className="card"
                >


                  <div className="
                    flex
                    items-center
                    justify-between
                  ">


                    <div className="
                      icon-wrapper
                    ">

                      <Icon
                        size={22}
                        className="text-blue-600"
                      />

                    </div>



                    <span className="
                      text-sm
                      font-semibold
                      text-slate-400
                    ">

                      {step.number}

                    </span>


                  </div>




                  <h3 className="
                    mt-6
                    card-title
                  ">

                    {step.title}

                  </h3>



                  <p className="
                    mt-3
                    text-slate-600
                  ">

                    {step.text}

                  </p>


                </div>

              );


            })}


          </div>


        </div>


      </section>







      {/* ================= HEALTH MONITORING ================= */}


      <section className="container section">


        <div className="
          grid
          lg:grid-cols-2
          gap-10
          items-center
        ">


          <div>


            <h2 className="page-title">

              Monitor your health trends

            </h2>



            <p className="
              mt-5
              text-slate-600
              leading-relaxed
            ">

              Track important health indicators over time.
              Historical records help you understand changes
              and make better decisions with your healthcare provider.

            </p>




            <div className="
              mt-8
              grid
              sm:grid-cols-3
              gap-4
            ">


              <div className="surface p-4">

                <Scale
                  size={22}
                  className="text-blue-600"
                />

                <p className="
                  mt-3
                  text-sm
                  font-medium
                  text-slate-700
                ">

                  BMI Tracking

                </p>

              </div>



              <div className="surface p-4">

                <Activity
                  size={22}
                  className="text-blue-600"
                />

                <p className="
                  mt-3
                  text-sm
                  font-medium
                  text-slate-700
                ">

                  Blood Pressure

                </p>

              </div>




              <div className="surface p-4">

                <Droplets
                  size={22}
                  className="text-blue-600"
                />

                <p className="
                  mt-3
                  text-sm
                  font-medium
                  text-slate-700
                ">

                  Blood Sugar

                </p>

              </div>


            </div>


          </div>





          {/* Future Chart Placeholder */}


          <div className="
            card
            min-h-[320px]
            flex
            items-center
            justify-center
            bg-slate-50
          ">


            <div className="text-center">


              <Activity
                size={48}
                className="
                  mx-auto
                  text-blue-600
                "
              />


              <h3 className="
                mt-5
                text-xl
                font-semibold
                text-slate-900
              ">

                Health Analytics

              </h3>


              <p className="
                mt-2
                text-slate-500
              ">

                Charts and health trends will appear here.

              </p>


            </div>


          </div>



        </div>


      </section>







      {/* ================= PRIVACY ================= */}


      <section className="
        bg-slate-50
        py-16
      ">


        <div className="
          container
          text-center
        ">


          <div className="
            max-w-3xl
            mx-auto
          ">


            <ShieldCheck
              size={42}
              className="
                mx-auto
                text-blue-600
              "
            />



            <h2 className="
              mt-5
              page-title
            ">

              Your health data, organized securely

            </h2>



            <p className="
              mt-4
              text-slate-600
            ">

              MediSync keeps your medical information organized
              and accessible while maintaining a secure personal
              healthcare environment.

            </p>


          </div>


        </div>


      </section>







      {/* ================= CALL TO ACTION ================= */}



      {!user && (

        <section className="
          container
          py-20
          text-center
        ">


          <h2 className="
            text-4xl
            font-bold
            text-slate-900
          ">

            Start managing your health today

          </h2>



          <p className="
            mt-4
            text-slate-600
          ">

            Create your MediSync account and keep your
            healthcare information organized.

          </p>




          <Link

            to="/signup"

            className="
              btn-primary
              mt-8
              inline-flex
            "

          >

            Create Account

          </Link>


        </section>

      )}


    </div>

  );

}