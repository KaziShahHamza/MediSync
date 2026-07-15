import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";


export default function Signup() {

  const navigate = useNavigate();



  const submit = async (e) => {

    e.preventDefault();

    const f = e.target;


    await fetch(
      "http://localhost:5000/api/auth/signup",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },

        body:JSON.stringify({
          name:f.name.value,
          email:f.email.value,
          password:f.password.value
        })
      }
    );


    navigate("/login");

  };




  return (

    <AuthLayout

      title="Create Account"

      subtitle="Start managing your health with MediSync."

    >


      <form
        onSubmit={submit}
        className="space-y-5"
      >



        <input
          name="name"
          placeholder="Full Name"
          className="input"
          required
        />



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
          className="
            btn-primary
            w-full
            py-3
          "
        >

          Create Account

        </button>




        <p className="
          text-sm
          text-center
          text-slate-600
        ">


          Already have an account?


          <Link
            to="/login"
            className="
              ml-1
              text-sky-600
              font-medium
              hover:underline
            "
          >

            Login

          </Link>


        </p>



      </form>


    </AuthLayout>

  );

}