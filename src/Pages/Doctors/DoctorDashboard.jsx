import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:5000/api/v1";

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // For sorting appointments by date

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      if (!token) {
        throw new Error("No token found. Please log in to access the dashboard.");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      // Fetch doctor profile
      const profileRes = await axios.get(`${BASE_URL}/doctors/profile/me`, config);
      setProfile(profileRes.data.data);

      // Fetch appointments
      const appointmentsRes = await axios.get(`${BASE_URL}/doctors/appointments/doctor`, config);
      setAppointments(appointmentsRes.data?.data || []);
    } catch (error) {
      console.error("Fetch error:", error);
      let errorMessage = error.response?.data?.message || error.message;
      if (error.response?.status === 401) {
        errorMessage = "Unauthorized. Please log in to access the dashboard.";
        localStorage.removeItem("token");
        navigate("/login");
      } else if (error.response?.status === 403) {
        errorMessage = error.response?.data?.message || "Access denied. Your account may not be approved.";
      } else if (error.response?.status === 404) {
        errorMessage = "Account must be admin approved.";
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [token, navigate]);

  const handleAppointmentAction = async (appointmentId, action) => {
    try {
      setError(null);
      setSuccess(null);

      if (!token) {
        setError("You must be logged in to perform this action");
        navigate("/login");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      let endpoint;
      let successMessage;
      let body = {};
      switch (action) {
        case "accept":
          endpoint = `${BASE_URL}/doctors/appointments/${appointmentId}/accept`;
          successMessage = "Appointment accepted successfully";
          break;
        case "reject":
          endpoint = `${BASE_URL}/doctors/appointments/${appointmentId}/reject`;
          successMessage = "Appointment rejected successfully";
          break;
        case "complete":
          endpoint = `${BASE_URL}/appointments/${appointmentId}/status`;
          successMessage = "Appointment marked as completed";
          body = { status: "completed" };
          break;
        default:
          throw new Error("Invalid action");
      }

      const res = await axios.put(endpoint, body, config);

      if (res.data.success) {
        setSuccess(successMessage);
        fetchData();
      } else {
        setError(res.data.message || `Failed to ${action} appointment`);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || `Error ${action}ing appointment`;
      setError(errorMessage);
      if (error.response?.status === 401) {
        setError("Unauthorized. Please log in to perform this action.");
        localStorage.removeItem("token");
        navigate("/login");
      } else if (error.response?.status === 404) {
        setError("Appointment not found or already processed.");
      }
    }
  };

  const deleteAppointment = async (appointmentId) => {
    if (!window.confirm("Are you sure you want to delete this appointment?")) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);

      if (!token) {
        setError("You must be logged in to delete an appointment");
        navigate("/login");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const res = await axios.delete(`${BASE_URL}/appointments/${appointmentId}`, config);
      if (res.data.success) {
        setSuccess("Appointment deleted successfully");
        fetchData();
      } else {
        setError(res.data.message || "Failed to delete appointment");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to delete appointment";
      setError(`Delete appointment error: ${errorMessage}`);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else if (err.response?.status === 404) {
        setError("Appointment not found or you are not authorized to delete it.");
      }
    }
  };

  const deleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    try {
      setError(null);
      setSuccess(null);

      if (!token) {
        setError("You must be logged in to delete your account");
        navigate("/login");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const res = await axios.delete(`${BASE_URL}/doctors/profile/me`, config);
      if (res.data.success) {
        setSuccess("Account deleted successfully");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        setError(res.data.message || "Failed to delete account");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Error deleting account";
      setError(errorMessage);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  // Sort appointments by date
  const handleSortByDate = () => {
    const sortedAppointments = [...appointments].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
    setAppointments(sortedAppointments);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  // Manual refresh button handler
  const handleRefresh = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Poll every 30 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [fetchData]);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-6 text-gray-800">Doctor Dashboard</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8">
        <button
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === "profile" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            activeTab === "appointments" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          onClick={() => setActiveTab("appointments")}
        >
          Appointments
        </button>
      </div>

      {/* Loading, Error, and Success States */}
      {loading && <p className="text-gray-500 text-lg">Loading...</p>}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {success}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div id="doctor-profile" className="bg-white p-8 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Doctor Profile</h2>
            {profile && (
              <div className="flex gap-3">
                <i
                  className="fas fa-edit"
                  onClick={() => navigate("/doctor/profile-edit")}
                  style={{
                    color: "#007bff",
                    cursor: "pointer",
                    fontSize: "1.25rem",
                  }}
                  title="Edit Profile"
                  aria-label="Edit Profile"
                ></i>
                <i
                  className="fas fa-trash-can"
                  onClick={deleteAccount}
                  style={{
                    color: "#dc3545",
                    cursor: "pointer",
                    fontSize: "1.25rem",
                  }}
                  title="Delete Account"
                  aria-label="Delete Account"
                ></i>
              </div>
            )}
          </div>
          {profile ? (
            <div className="space-y-4">
              <p className="text-lg"><strong className="font-medium">Name:</strong> {profile.name}</p>
              <p className="text-lg"><strong className="font-medium">Email:</strong> {profile.email}</p>
              <p className="text-lg"><strong className="font-medium">Specialization:</strong> {profile.specialization || "Not specified"}</p>
              <p className="text-lg"><strong className="font-medium">Phone:</strong> {profile.phone || "Not specified"}</p>
              <p className="text-lg"><strong className="font-medium">Qualifications:</strong> {profile.qualifications || "-"}</p>
              <p className="text-lg"><strong className="font-medium">Status:</strong> {profile.isApproved ? "Approved" : "Pending Approval"}</p>
            </div>
          ) : (
            <p className="text-gray-600">No profile data available.</p>
          )}
        </div>
      )}

      {/* Appointments Tab */}
      {activeTab === "appointments" && (
        <div id="appointments-list" className="bg-white p-8 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Appointments</h2>
            <div className="flex space-x-3">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                onClick={handleSortByDate}
              >
                Sort by Date ({sortOrder === "asc" ? "Ascending" : "Descending"})
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                onClick={handleRefresh}
              >
                Refresh
              </button>
            </div>
          </div>
          {appointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-6 py-3 text-left text-gray-700 font-semibold">Patient</th>
                    <th className="border px-6 py-3 text-left text-gray-700 font-semibold">Date</th>
                    <th className="border px-6 py-3 text-left text-gray-700 font-semibold">Time</th>
                    <th className="border px-6 py-3 text-left text-gray-700 font-semibold">Purpose</th>
                    <th className="border px-6 py-3 text-left text-gray-700 font-semibold">Status</th>
                    <th className="border px-6 py-3 text-left text-gray-700 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment._id} className="hover:bg-gray-50 transition-colors">
                      <td className="border px-6 py-3">{appointment.patientName || "Not specified"}</td>
                      <td className="border px-6 py-3">{formatDate(appointment.date)}</td>
                      <td className="border px-6 py-3">{appointment.time || "Not specified"}</td>
                      <td className="border px-6 py-3">{appointment.purpose || "Not specified"}</td>
                      <td className="border px-6 py-3">
                        <span
                          className={`px-3 py-1 rounded text-white text-sm font-medium ${
                            appointment.status === "accepted"
                              ? "bg-green-500"
                              : appointment.status === "rejected"
                              ? "bg-red-500"
                              : appointment.status === "cancelled"
                              ? "bg-gray-500"
                              : appointment.status === "completed"
                              ? "bg-blue-500"
                              : "bg-yellow-500"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                      <td className="border px-6 py-3">
                        <div className="flex space-x-3 items-center">
                          {appointment.status === "pending" && (
                            <>
                              <button
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                                onClick={() => handleAppointmentAction(appointment._id, "accept")}
                                disabled={loading}
                              >
                                Accept
                              </button>
                              <button
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                                onClick={() => handleAppointmentAction(appointment._id, "reject")}
                                disabled={loading}
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {appointment.status === "accepted" && (
                            <button
                              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                              onClick={() => handleAppointmentAction(appointment._id, "complete")}
                              disabled={loading}
                            >
                              Complete
                            </button>
                          )}
                          {(appointment.status === "accepted" || appointment.status === "rejected" || appointment.status === "cancelled" || appointment.status === "completed") && (
                            <i
                              className="fas fa-trash-can"
                              onClick={() => deleteAppointment(appointment._id)}
                              style={{
                                color: loading ? "#6c757d" : "#dc3545",
                                cursor: loading ? "not-allowed" : "pointer",
                                fontSize: "1.25rem",
                              }}
                              title="Delete Appointment"
                              aria-label="Delete Appointment"
                            ></i>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No appointments found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;