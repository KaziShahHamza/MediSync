// client/src/pages/Login.jsx

// Renders the user login form.
// Authenticates the user and redirects to the dashboard after success.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";

const API_URL = import.meta.env.VITE_API_URL;

// Provides username/email and password authentication.
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Submits credentials to the authentication endpoint.
  async function submit(event) {
    event.preventDefault();

    const form = event.currentTarget;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: form.identifier.value,
          password: form.password.value,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Login failed.");
      }

      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Login to access your health dashboard."
    >
      {/* Login form and authentication feedback. */}
      <form onSubmit={submit} className="space-y-5">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <input
          name="identifier"
          type="text"
          placeholder="Username or Email"
          className="input"
          autoComplete="username"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          className="input"
          autoComplete="current-password"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-slate-600">
          Don't have an account?
          <Link
            to="/signup"
            className="ml-1 font-medium text-sky-600 hover:underline"
          >
            Create account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
