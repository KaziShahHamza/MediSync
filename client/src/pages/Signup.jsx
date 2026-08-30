//client/src/pages/Signup.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/auth/AuthLayout";

const API_URL = import.meta.env.VITE_API_URL;

export default function Signup() {
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
      const res = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: f.name.value,
          username: f.username.value,
          email: f.email.value,
          password: f.password.value,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Signup failed");
      }

      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Start managing your health with MediSync."
    >
      {" "}
      <form onSubmit={submit} className="space-y-5">
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <input name="name" placeholder="Full Name" className="input" required />

        <input
          name="username"
          type="text"
          placeholder="Username"
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
          placeholder="Password (minimum 8 characters)"
          className="input"
          minLength={8}
          required
        />

        <button
          disabled={loading}
          className="btn-primary w-full py-3 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-sm text-center text-slate-600">
          Already have an account?
          <Link
            to="/login"
            className="ml-1 text-sky-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
