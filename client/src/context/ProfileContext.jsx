// src/context/ProfileContext.jsx

// Provides profile and user information to authenticated pages.
// Handles profile retrieval and shared profile loading state.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { useAuth } from "./AuthContext";

const ProfileContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL;

// Provides profile state and backend profile operations.
export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  // Fetches profile and associated user information.
  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setProfile(null);
      setUserInfo(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to fetch profile.");
      }

      setUserInfo(data?.user || null);
      setProfile(data?.profile || null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Synchronizes profile state with authentication state.
  useEffect(() => {
    if (user) {
      fetchProfile().catch((error) => {
        console.error("Profile fetch failed:", error);
      });
      return;
    }

    setProfile(null);
    setUserInfo(null);
    setLoading(false);
  }, [user, fetchProfile]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        userInfo,
        setUserInfo,
        loading,
        fetchProfile,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

// Provides safe access to profile context state.
export function useProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider.");
  }

  return context;
}
