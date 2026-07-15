// src/context/ProfileContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");


  const fetchProfile = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      setUserInfo(data.user);
      setProfile(data.profile);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

    useEffect(() => {
    fetchProfile();
    }, [token]);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        setProfile,
        userInfo,
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