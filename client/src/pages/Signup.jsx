// client/src/pages/Signup.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../components/AuthLayout";

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
      <form onSubmit={submit} className="ms-form">
        {error && (
          <div className="ms-alert ms-alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="ms-field">
          <label htmlFor="signup-name" className="ms-label">
            Full Name
          </label>

          <input
            id="signup-name"
            name="name"
            type="text"
            className="ms-input"
            placeholder="Full Name"
            autoComplete="name"
            required
          />
        </div>

        <div className="ms-field">
          <label htmlFor="signup-username" className="ms-label">
            Username
          </label>

          <input
            id="signup-username"
            name="username"
            type="text"
            className="ms-input"
            placeholder="Username"
            autoComplete="username"
            required
          />
        </div>

        <div className="ms-field">
          <label htmlFor="signup-email" className="ms-label">
            Email Address
          </label>

          <input
            id="signup-email"
            name="email"
            type="email"
            className="ms-input"
            placeholder="Email Address"
            autoComplete="email"
            required
          />
        </div>

        <div className="ms-field">
          <label htmlFor="signup-password" className="ms-label">
            Password
          </label>

          <input
            id="signup-password"
            name="password"
            type="password"
            className="ms-input"
            placeholder="Password (minimum 8 characters)"
            autoComplete="new-password"
            minLength={8}
            required
          />

          <p className="ms-help-text">
            Password must contain at least 8 characters.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`ms-btn ms-btn-primary ms-btn-lg ms-btn-full ${
            loading ? "ms-btn-loading" : ""
          }`}
        >
          <span>{loading ? "Creating account..." : "Create Account"}</span>
        </button>

        <p className="ms-auth-switch">
          <span>Already have an account?</span>

          <Link to="/login">Login</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
