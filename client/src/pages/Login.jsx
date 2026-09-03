// client/src/pages/Login.jsx

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";

const API_URL = import.meta.env.VITE_API_URL;

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
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: f.identifier.value,
          password: f.password.value,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
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
      title="Welcome Back"
      subtitle="Login to access your health dashboard."
    >
      <form onSubmit={submit} className="ms-form">
        {error && (
          <div className="ms-alert ms-alert-danger" role="alert">
            {error}
          </div>
        )}

        <div className="ms-field">
          <label htmlFor="login-identifier" className="ms-label">
            Username or Email
          </label>

          <input
            id="login-identifier"
            name="identifier"
            type="text"
            className="ms-input"
            placeholder="Username or Email"
            autoComplete="username"
            required
          />
        </div>

        <div className="ms-field">
          <label htmlFor="login-password" className="ms-label">
            Password
          </label>

          <input
            id="login-password"
            name="password"
            type="password"
            className="ms-input"
            placeholder="Password"
            autoComplete="current-password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`ms-btn ms-btn-primary ms-btn-lg ms-btn-full ${
            loading ? "ms-btn-loading" : ""
          }`}
        >
          <span>{loading ? "Logging in..." : "Login"}</span>
        </button>

        <p className="ms-auth-switch">
          <span>Don't have an account?</span>

          <Link to="/signup">Create account</Link>
        </p>
      </form>
    </AuthLayout>
  );
}
