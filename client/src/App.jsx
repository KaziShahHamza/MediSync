// client/src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import { AuthProvider } from "./context/AuthContext";
import { MedicineProvider } from "./context/MedicineContext";
import { ProfileProvider } from "./context/ProfileContext";
import { PrescriptionProvider } from "./context/PrescriptionContext";
import { DoctorProvider } from "./context/DoctorContext";
import { ThemeProvider } from "./context/ThemeContext";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Profile from "./pages/Profile";
import Medicines from "./pages/Medicines";
import Health from "./pages/Health";
import Prescriptions from "./pages/Prescriptions";
import Doctors from "./pages/Doctors";
import Dashboard from "./pages/Dashboard";

// import useMedicineReminder from "./hooks/useMedicineReminder";

// function ReminderWrapper() {
//   const { medicines } = useMedicines();
//   useMedicineReminder(medicines);
//   return null;
// }

export default function App() {
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <ProfileProvider>
          <MedicineProvider>
            <PrescriptionProvider>
              <DoctorProvider>
                <BrowserRouter>
                  <div className="ms-app-shell">
                    <Navbar />

                    {/* Background reminder engine */}
                    {/* <ReminderWrapper /> */}

                    <main className="ms-main">
                      <Routes>
                        {/* Public Routes */}

                        <Route path="/" element={<Home />} />

                        <Route path="/login" element={<Login />} />

                        <Route path="/signup" element={<Signup />} />

                        {/* Protected Routes */}

                        <Route
                          path="/dashboard"
                          element={
                            <ProtectedRoute>
                              <Dashboard />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/medicines"
                          element={
                            <ProtectedRoute>
                              <Medicines />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/health"
                          element={
                            <ProtectedRoute>
                              <Health />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/prescriptions"
                          element={
                            <ProtectedRoute>
                              <Prescriptions />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/doctors"
                          element={
                            <ProtectedRoute>
                              <Doctors />
                            </ProtectedRoute>
                          }
                        />

                        <Route
                          path="/profile"
                          element={
                            <ProtectedRoute>
                              <Profile />
                            </ProtectedRoute>
                          }
                        />
                      </Routes>
                    </main>
                  </div>
                </BrowserRouter>
              </DoctorProvider>
            </PrescriptionProvider>
          </MedicineProvider>
        </ProfileProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
