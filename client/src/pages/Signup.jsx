// client/src/pages/Signup.jsx

// Renders the account registration form.
// Creates a user account and redirects to the dashboard after success.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";

const API_URL = import.meta.env.VITE_API_URL;

// Provides new-user registration and authentication.
export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Submits registration data to the authentication endpoint.
  async function submit(event) {
    event.preventDefault();

    const form = event.currentTarget;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.value,
          username: form.username.value,
          email: form.email.value,
          password: form.password.value,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Signup failed.");
      }

      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Start managing your health with MediSync."
    >
      {/* Registration form and authentication feedback. */}
      <form onSubmit={submit} className="space-y-5">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <input
          name="name"
          placeholder="Full Name"
          className="input"
          autoComplete="name"
          required
        />

        <input
          name="username"
          type="text"
          placeholder="Username"
          className="input"
          autoComplete="username"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email Address"
          className="input"
          autoComplete="email"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password (minimum 8 characters)"
          className="input"
          autoComplete="new-password"
          minLength={8}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create Account"}
        </button>

        <p className="text-center text-sm text-slate-600">
          Already have an account?
          <Link
            to="/login"
            className="ml-1 font-medium text-sky-600 hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
