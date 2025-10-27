import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Table, Button, Alert, Tabs, Tab, Card } from "react-bootstrap";
import { BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("appointments");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      if (!token) {
        setError("You must be logged in to view your profile");
        navigate("/login");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const res = await axios.get(`${BASE_URL}/patients/profile/me`, config);
      if (res.data.success) {
        setProfile(res.data.data);
      } else {
        setError(res.data.message || "Failed to fetch profile");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Error fetching profile";
      setError(errorMessage);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (!token) {
        setError("You must be logged in to view your dashboard");
        navigate("/login");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const res = await axios.get(`${BASE_URL}/appointments/patient`, config);
      if (res.data.success) {
        setAppointments(res.data.data || []);
      } else {
        setError(res.data.message || "Failed to fetch appointments");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Error fetching appointments";
      setError(errorMessage);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      setError("");
      setSuccess("");

      if (!token) {
        setError("You must be logged in to cancel an appointment");
        navigate("/login");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const res = await axios.put(`${BASE_URL}/appointments/${appointmentId}/cancel`, {}, config);
      if (res.data.success) {
        setSuccess("Appointment cancelled successfully");
        fetchAppointments();
      } else {
        setError(res.data.message || "Failed to cancel appointment");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to cancel appointment";
      setError(`Cancel appointment error: ${errorMessage}`);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  const deleteAppointment = async (appointmentId) => {
    try {
      setError("");
      setSuccess("");

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
        fetchAppointments();
      } else {
        setError(res.data.message || "Failed to delete appointment");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to delete appointment";
      setError(`Delete appointment error: ${errorMessage}`);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  };

  const deleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    try {
      setError("");
      setSuccess("");

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

      const res = await axios.delete(`${BASE_URL}/patients/account`, config);
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

  useEffect(() => {
    fetchProfile();
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 30000); // Poll every 30 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <Container className="my-5">
      <h2 className="mb-4">Patient Dashboard</h2>

      {/* Patient Profile Card */}
      {profile && (
        <Card className="mb-4">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Card.Title>Patient Profile</Card.Title>
                <div className="d-flex flex-column">
                  <p className="mb-1"><strong>Name:</strong> {profile.name}</p>
                  <p className="mb-1"><strong>Email:</strong> {profile.email}</p>
                  <p className="mb-1"><strong>Phone:</strong> {profile.phone || "Not specified"}</p>
                </div>
              </div>
              <div className="d-flex gap-2">
                <i
                  className="fas fa-edit"
                  onClick={() => navigate("/profile/edit")}
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
            </div>
          </Card.Body>
        </Card>
      )}

      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
        <Tab eventKey="appointments" title="My Appointments">
          {loading && <p>Loading...</p>}
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          {appointments.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Doctor</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Purpose</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>Dr. {appointment.doctor?.name || "Unknown Doctor"}</td>
                    <td>{new Date(appointment.date).toLocaleDateString()}</td>
                    <td>{appointment.time || "Not specified"}</td>
                    <td>{appointment.purpose || "Not specified"}</td>
                    <td>
                      <span
                        className={`badge ${
                          appointment.status === "accepted"
                            ? "bg-success"
                            : appointment.status === "rejected"
                            ? "bg-danger"
                            : appointment.status === "cancelled"
                            ? "bg-secondary"
                            : appointment.status === "completed"
                            ? "bg-primary"
                            : "bg-warning"
                        } text-white`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                    <td>
                      {(appointment.status === "pending" || appointment.status === "accepted") && (
                        <span
                          onClick={() => !loading && cancelAppointment(appointment._id)}
                          title="Cancel Appointment"
                          className="bg-secondary text-white d-flex align-items-center justify-content-center me-2"
                          style={{
                            width: '40px',
                            height: '30px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.5 : 1,
                            userSelect: 'none',
                          }}
                        >
                          Cancel
                        </span>
                      )}
                      {(appointment.status === "cancelled" || appointment.status === "rejected" || appointment.status === "completed") && (
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>No appointments found.</p>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default PatientDashboard;