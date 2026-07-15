import { useState } from "react";
import {
  Droplets,
  Save,
} from "lucide-react";


export default function BloodSugarForm({
  onAdd,
}) {


  const [glucose, setGlucose] = useState("");





  const handleSubmit = async (e)=>{


    e.preventDefault();



    if (!glucose) return;



    await onAdd({

      type: "diabetes",

      glucose,

    });



    setGlucose("");

  };






  return (

    <form

      onSubmit={handleSubmit}

      className="card space-y-6"

    >




      <div className="
        flex
        items-center
        gap-3
      ">



        <div className="icon-wrapper">


          <Droplets

            size={22}

            className="text-blue-600"

          />


        </div>




        <h3 className="card-title">

          Blood Sugar

        </h3>


      </div>







      <div>


        <label>

          Blood Glucose

        </label>



        <input

          type="number"

          step="0.1"

          className="input"

          placeholder="Example: 95"

          value={glucose}

          onChange={
            (e)=>setGlucose(e.target.value)
          }


        />


      </div>







      <p className="
        text-sm
        text-slate-500
      ">

        Normal fasting range: 70–99 mg/dL

      </p>







      <button

        type="submit"

        className="btn-primary w-full"

      >



        <Save size={18}/>



        Save Blood Sugar



      </button>





    </form>

  );

}