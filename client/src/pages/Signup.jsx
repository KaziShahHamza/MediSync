// client/src/pages/Signup.jsx

// Renders the account registration form.
// Creates a user account and redirects to the dashboard after success.

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";
import { validateSignupForm } from "../utils/auth/authValidation";

const API_URL = import.meta.env.VITE_API_URL;

// Provides new-user registration and authentication.
export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // Submits registration data to the authentication endpoint.
  async function submit(event) {
    event.preventDefault();

    const form = event.currentTarget;

    // Validate and normalize account details before contacting the API.
    const validation = validateSignupForm({
      name: form.name.value,
      username: form.username.value,
      email: form.email.value,
      password: form.password.value,
    });

    if (Object.keys(validation.errors).length > 0) {
      setFieldErrors(validation.errors);
      setError("");
      return;
    }

    setLoading(true);
    setError("");
    setFieldErrors({});

    // Submit the normalized registration data to the signup endpoint.
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validation.values),
      });

      const data = await response.json();

      if (!response.ok) {
        const nextFieldErrors = Object.fromEntries(
          (data?.errors || []).map(({ field, message }) => [field, message]),
        );

        setFieldErrors(nextFieldErrors);
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
        {fieldErrors.name && (
          <p className="text-sm text-red-600">{fieldErrors.name}</p>
        )}

        <input
          name="username"
          type="text"
          placeholder="Username"
          className="input"
          autoComplete="username"
          required
        />
        {fieldErrors.username && (
          <p className="text-sm text-red-600">{fieldErrors.username}</p>
        )}

        <input
          name="email"
          type="email"
          placeholder="Email Address"
          className="input"
          autoComplete="email"
          required
        />
        {fieldErrors.email && (
          <p className="text-sm text-red-600">{fieldErrors.email}</p>
        )}

        <input
          name="password"
          type="password"
          placeholder="Password (minimum 8 characters)"
          className="input"
          autoComplete="new-password"
          minLength={8}
          required
        />
        {fieldErrors.password && (
          <p className="text-sm text-red-600">{fieldErrors.password}</p>
        )}

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
