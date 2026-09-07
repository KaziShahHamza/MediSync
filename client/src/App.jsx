// client/src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import { AuthProvider } from "./context/AuthContext";
import { MedicineProvider } from "./context/MedicineContext";
import { ProfileProvider } from "./context/ProfileContext";
import { PrescriptionProvider } from "./context/PrescriptionContext";
import { DoctorProvider } from "./context/DoctorContext";
import { ReportProvider } from "./context/ReportContext";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Profile from "./pages/Profile";
import Medicines from "./pages/Medicines";
import Health from "./pages/Health";
import Prescriptions from "./pages/Prescriptions";
import Reports from "./pages/Reports";
import Doctors from "./pages/Doctors";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";

export default function App() {
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <AuthProvider>
      <ProfileProvider>
        <MedicineProvider>
          <PrescriptionProvider>
            <ReportProvider>
              <DoctorProvider>
                <BrowserRouter>
                  <ScrollToTop />
                  <Navbar />

                  {/* Background reminder engine */}
                  {/* <ReminderWrapper /> */}

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
                      path="/reports"
                      element={
                        <ProtectedRoute>
                          <Reports />
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

                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute>
                          <Settings />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </BrowserRouter>
              </DoctorProvider>
            </ReportProvider>
          </PrescriptionProvider>
        </MedicineProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}
