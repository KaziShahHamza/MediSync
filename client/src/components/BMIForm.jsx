import { useMemo, useState } from "react";
import {
  Scale,
  Save,
  Ruler,
  Weight,
} from "lucide-react";

import BMIResult from "./BMIResult";



export default function BMIForm({
  onAdd,
}) {


  const [height, setHeight] = useState("");

  const [weight, setWeight] = useState("");






  const bmi = useMemo(() => {


    if (!height || !weight) return null;


    const h = Number(height) / 100;


    return (
      Number(weight) /
      (h * h)
    ).toFixed(1);



  }, [height, weight]);








  const handleSubmit = async (e)=>{


    e.preventDefault();



    if (!height || !weight) return;



    await onAdd({

      type: "bmi",

      height: Number(height),

      weight: Number(weight),

      bmi: Number(bmi),

    });




    setHeight("");

    setWeight("");

  };








  return (


    <form

      onSubmit={handleSubmit}

      className="
        card
        space-y-6
      "

    >




      {/* Header */}



      <div className="
        flex
        items-center
        gap-3
      ">


        <div className="icon-wrapper">


          <Scale

            size={22}

            className="text-blue-600"

          />


        </div>




        <h3 className="card-title">

          BMI Calculator

        </h3>


      </div>









      {/* Height */}



      <div>


        <label>

          Height

        </label>




        <div className="
          relative
        ">


          <Ruler

            size={18}

            className="
              absolute
              left-3
              top-3
              text-slate-400
            "

          />



          <input


            type="number"


            className="
              input
              pl-10
            "


            placeholder="Height in cm"


            value={height}


            onChange={
              (e)=>
              setHeight(e.target.value)
            }


          />


        </div>


      </div>








      {/* Weight */}



      <div>


        <label>

          Weight

        </label>




        <div className="
          relative
        ">



          <Weight

            size={18}

            className="
              absolute
              left-3
              top-3
              text-slate-400
            "

          />



          <input


            type="number"


            className="
              input
              pl-10
            "


            placeholder="Weight in kg"


            value={weight}


            onChange={
              (e)=>
              setWeight(e.target.value)
            }


          />


        </div>


      </div>









      <BMIResult

        bmi={bmi}

      />









      <button

        type="submit"


        disabled={!bmi}


        className="
          btn-primary
          w-full
          disabled:opacity-50
          disabled:cursor-not-allowed
        "


      >



        <Save

          size={18}

        />



        Save BMI



      </button>






    </form>


  );

}