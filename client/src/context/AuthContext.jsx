// client/src/context/AuthContext.jsx

// Provides global authentication state and session management.
// Persists the authenticated user and JWT token in local storage.

import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

function getStoredUser() {
  try {
    const storedUser = localStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Failed to parse stored user:", error);

    localStorage.removeItem("user");

    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  // Stores the authenticated session after a successful login.
  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setUser(data.user);
  };

  // Clears only authentication data and resets the current session.
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  // Exposes authentication state and session actions to consumers.
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
