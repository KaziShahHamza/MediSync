import { useState } from "react";
import {
  HeartPulse,
  Save,
} from "lucide-react";


export default function BloodPressureForm({
  onAdd,
}) {


  const [high, setHigh] = useState("");

  const [low, setLow] = useState("");





  const handleSubmit = async (e) => {

    e.preventDefault();


    if (!high || !low) return;



    await onAdd({

      type: "bp",

      High: high,

      Low: low,

    });



    setHigh("");

    setLow("");

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


          <HeartPulse

            size={22}

            className="text-blue-600"

          />


        </div>




        <h3 className="card-title">

          Blood Pressure

        </h3>


      </div>







      <div>


        <label>

          Systolic Pressure

        </label>


        <input

          type="number"

          className="input"

          placeholder="Example: 120"

          value={high}

          onChange={
            (e)=>setHigh(e.target.value)
          }

        />


      </div>







      <div>


        <label>

          Diastolic Pressure

        </label>


        <input

          type="number"

          className="input"

          placeholder="Example: 80"

          value={low}

          onChange={
            (e)=>setLow(e.target.value)
          }

        />


      </div>







      <p className="
        text-sm
        text-slate-500
      ">

        Normal range: below 120 / 80 mmHg

      </p>






      <button

        type="submit"

        className="btn-primary w-full"

      >


        <Save size={18}/>


        Save Blood Pressure


      </button>




    </form>

  );

}