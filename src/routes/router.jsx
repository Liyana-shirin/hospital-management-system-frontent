// Routers.jsx
import { Routes, Route } from "react-router-dom";
import Home from "../Pages/Home.jsx";
import Login from "../Pages/Login.jsx";
import Signup from "../Pages/Signup.jsx";
import Services from "../Pages/Services.jsx";
import Contact from "../Pages/Contact.jsx";
import FindDoctors from "../Pages/Doctors/FindDoctors.jsx";
import BookAppointment from "../Pages/Appointments/BookAppointment.jsx";
import AdminDashboard from "../Pages/admin/AdminDashboard.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Unauthorized from "../Pages/unathorized.jsx";
import Sidebar from "../Pages/Sidebar.jsx";
import DoctorDashboard from "../Pages/Doctors/DoctorDashboard.jsx";
import EditDoctorProfile from "../Pages/Doctors/DocAccountEdit.jsx";
import PatientDashboard from "../Pages/Patient/PatientDashboard.jsx";
import ProfileEdit from "../Pages/Patient/patientAccountedit.jsx";
const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/doctor/profile-edit" element={<EditDoctorProfile />} />
      <Route path="/doctors/find" element={<FindDoctors />} />
      <Route path="/book-appointment/:doctorId" element={<BookAppointment />} /> 
      <Route path="/sidebar" element={<Sidebar />} />
      <Route path="/profile/edit" element={<ProfileEdit />} />
      
      <Route
        path="/patient-dashboard"
        element={
          <ProtectedRoute allowedRoles={["patient"]}>
            <PatientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor-dashboard"
        element={
          <ProtectedRoute allowedRoles={["doctor"]}>
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
     

      {/* <Route
        path="/appointments/manage"
        element={
          <ProtectedRoute allowedRoles={["doctor", "admin"]}>
            <ManageAppointments />
          </ProtectedRoute>
        }
      /> */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route path="/unauthorized" element={<Unauthorized />} />
    </Routes>
  );
};

export default Routers;