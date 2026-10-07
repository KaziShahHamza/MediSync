// server/controllers/authController.js

// Handles authentication HTTP requests and returns API responses.

import { signupUser, loginUser } from "../services/authService.js";

// Handle user registration requests.
export async function signup(req, res) {
  try {
    const { name, username, email, password } = req.body;

    // Create the account through the auth service.
    const result = await signupUser({
      name,
      username,
      email,
      password,
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(error.status || 500).json({
      message: error.status === 400 ? error.message : "Signup failed",
    });
  }
}

// Handle user login requests.
export async function login(req, res) {
  try {
    const { identifier, password } = req.body;

    // Authenticate the supplied credentials.
    const result = await loginUser({
      identifier,
      password,
    });

    if (result.error) {
      return res.status(result.status).json({
        message: result.error,
      });
    }

    return res.json(result);
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Login failed",
    });
  }
}
