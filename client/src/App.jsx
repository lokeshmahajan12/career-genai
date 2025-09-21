import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Advisor from "./pages/Advisor";
import Profile from "./pages/Profile";
import Resume from "./pages/Resume";
import Courses from "./pages/Courses";
import ResumeUpload from "./components/ResumeUpload";
import UserProfile from "./components/UserProfile";
import ProfileForm from "./components/ProfileForm";

export default function App() {
  // For now hardcoded user (later you can take from auth context / Redux)
  const user = {
    id: "123", // dummy id (MongoDB ObjectId from backend once logged in)
    name: "Lokesh Mahajan",
    email: "lokesh@test.com",
  };

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courses" element={<Courses />} />

        <Route
          path="/advisor"
          element={
            <ProtectedRoute>
              <Advisor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {/* ✅ Pass user as prop */}
              <Dashboard user={user} />
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

        {/* Resume page protected */}
        <Route
          path="/resume"
          element={
            <ProtectedRoute>
              <Resume />
            </ProtectedRoute>
          }
        />

        {/* Public Resume Upload */}
        <Route path="/upload-resume" element={<ResumeUpload />} />

        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/profileform" element={<ProfileForm />} />
      </Routes>
    </>
  );
}
