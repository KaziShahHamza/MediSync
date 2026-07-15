export default function AuthLayout({
  title,
  subtitle,
  children,
}) {

  return (

    <div className="
      min-h-[calc(100vh-80px)]
      bg-slate-50
      flex
      items-center
      justify-center
      px-4
      py-12
    ">


      <div className="
        grid
        lg:grid-cols-2
        max-w-5xl
        w-full
        bg-white
        rounded-3xl
        overflow-hidden
        border
        border-slate-200
        shadow-sm
      ">



        {/* LEFT SIDE */}


        <div className="
          hidden
          lg:flex
          flex-col
          justify-center
          p-12
          bg-sky-50
        ">


          <h1 className="
            text-4xl
            font-bold
            text-slate-800
            leading-tight
          ">

            Manage Your Health
            <span className="text-sky-600">
              {" "}Smarter
            </span>

          </h1>



          <p className="
            mt-5
            text-slate-600
            leading-relaxed
          ">

            Keep medicines, health records,
            doctors, and medical documents
            organized in one secure place.

          </p>



          <div className="
            mt-8
            space-y-3
          ">


            {[
              "Medicine reminders",
              "Health tracking",
              "Medical records",
              "Doctor management",
            ].map(item => (

              <div
                key={item}
                className="
                  flex
                  items-center
                  gap-3
                  text-slate-700
                "
              >

                <div className="
                  w-2
                  h-2
                  rounded-full
                  bg-sky-600
                "/>


                {item}

              </div>

            ))}


          </div>


        </div>






        {/* FORM AREA */}


        <div className="
          p-6
          sm:p-10
          lg:p-12
        ">


          <div className="mb-8">

            <h2 className="
              text-3xl
              font-bold
              text-slate-800
            ">

              {title}

            </h2>


            <p className="
              mt-2
              text-slate-500
            ">

              {subtitle}

            </p>


          </div>



          {children}



        </div>


      </div>


    </div>

  );
}