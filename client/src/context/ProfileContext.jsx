// src/context/ProfileContext.jsx

import { createContext, useContext, useEffect, useState } from "react";

import { useAuth } from "./AuthContext";

const ProfileContext = createContext();

const API_URL = import.meta.env.VITE_API_URL;

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setProfile(null);
      setUserInfo(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/api/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await res.json();

      setUserInfo(data.user);
      setProfile(data.profile);
    } catch (err) {
      console.error("Profile fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setUserInfo(null);
      setLoading(false);
    }
  }, [user]);

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

export function useProfile() {
  return useContext(ProfileContext);
}
