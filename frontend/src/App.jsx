import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import StudentDashboard from "./pages/StudentDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./component/Navbar";
import PrivateRoute from "./utils/PrivateRoute";
import RoleRoute from "./utils/RoleRoute";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<LoginPage />} />

        {/* Protected by Role */}
        <Route
          path="/register"
          element={
            <RoleRoute allowed={["admin"]}>
              <AdminDashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/student"
          element={
            <RoleRoute allowed={["student"]}>
              <StudentDashboard />
            </RoleRoute>
          }
        />

        <Route
          path="/faculty"
          element={
            <RoleRoute allowed={["teacher"]}>
              <FacultyDashboard />
            </RoleRoute>
          }
        />

        {/* General authenticated route */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<div className="text-center mt-10">404 Page Not Found</div>} />
      </Routes>
    </>
  );
};

export default App;
