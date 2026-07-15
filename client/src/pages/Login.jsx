import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";


export default function Login() {

  const { login } = useAuth();

  const navigate = useNavigate();


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");



  const submit = async (e) => {

    e.preventDefault();

    const f = e.target;


    setLoading(true);
    setError("");



    try {


      const res = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method:"POST",

          headers:{
            "Content-Type":"application/json"
          },

          body:JSON.stringify({

            email:f.email.value,

            password:f.password.value

          })

        }
      );



      const data = await res.json();



      if(!res.ok){

        throw new Error(
          data.message || "Login failed"
        );

      }



      login(data);

      navigate("/dashboard");



    } catch(err){

      setError(
        err.message
      );

    } finally {

      setLoading(false);

    }

  };




  return (

    <AuthLayout

      title="Welcome Back"

      subtitle="Login to access your health dashboard."

    >



      <form
        onSubmit={submit}
        className="space-y-5"
      >



        {
          error && (

            <div
              className="
                rounded-lg
                bg-red-50
                border
                border-red-200
                px-4
                py-3
                text-sm
                text-red-600
              "
            >

              {error}

            </div>

          )
        }





        <input

          name="email"

          type="email"

          placeholder="Email Address"

          className="input"

          required

        />





        <input

          name="password"

          type="password"

          placeholder="Password"

          className="input"

          required

        />







        <button

          disabled={loading}

          className="
            btn-primary
            w-full
            py-3
            disabled:opacity-60
          "

        >

          {
            loading
            ? "Logging in..."
            : "Login"
          }


        </button>







        <p
          className="
            text-sm
            text-center
            text-slate-600
          "
        >

          Don't have an account?


          <Link

            to="/signup"

            className="
              ml-1
              text-sky-600
              font-medium
              hover:underline
            "

          >

            Create account

          </Link>


        </p>




      </form>



    </AuthLayout>

  );

}