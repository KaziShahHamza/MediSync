// server/services/authService.js

// Handles authentication database operations, password hashing, and JWT creation.

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

// Build the user object safe for API responses.
export function createSafeUserData(user) {
  return {
    _id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    profilePhotoUrl: user.profilePhotoUrl || "",
  };
}

// Create a new user account.
export async function signupUser({ name, username, email, password }) {
  // Check whether the username is already registered.
  const existingUsername = await User.findOne({
    username: username.toLowerCase(),
  });

  if (existingUsername) {
    const error = new Error("Username already exists");
    error.status = 400;
    throw error;
  }

  // Check whether the email is already registered.
  const existingEmail = await User.findOne({
    email: email.toLowerCase(),
  });

  if (existingEmail) {
    const error = new Error("Email already exists");
    error.status = 400;
    throw error;
  }

  // Hash the password before storing the account.
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    username,
    email,
    password: hashedPassword,
  });

  // Generate the authentication token.
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  return {
    token,
    user: createSafeUserData(user),
  };
}

// Authenticate an existing user account.
export async function loginUser({ identifier, password }) {
  let user;

  // Determine whether the identifier is an email.
  const isEmail = identifier.includes("@");

  if (isEmail) {
    user = await User.findOne({
      email: identifier.toLowerCase(),
    });
  } else {
    user = await User.findOne({
      username: identifier.toLowerCase(),
    });
  }

  // Return the existing API error for unknown users.
  if (!user) {
    return {
      error: "User not found",
      status: 404,
    };
  }

  // Compare the supplied password with the stored hash.
  const ok = await bcrypt.compare(password, user.password);

  if (!ok) {
    return {
      error: "Wrong password",
      status: 401,
    };
  }

  // Generate the authentication token.
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  return {
    token,
    user: createSafeUserData(user),
  };
}
