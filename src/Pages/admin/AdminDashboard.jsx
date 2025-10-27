import React, { useState, useEffect } from "react";
import {
 Container, Tab, Tabs, Table, Spinner, Alert, Button, Form
} from "react-bootstrap";
import axios from "axios";
import { BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaTrash, FaCheck } from "react-icons/fa";

const AdminDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState('all');

  const token = localStorage.getItem("token");
  const headers = {
    Authorization: `Bearer ${token}`
  };
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch patients
      let patientsRes;
      try {
        patientsRes = await axios.get(`${BASE_URL}/admin/patients`, { headers });
        if (patientsRes.data?.success) {
          setPatients(patientsRes.data.data || []);
        } else {
          setPatients([]);
          toast.error(patientsRes.data.message || "Failed to fetch patients");
        }
      } catch (err) {
        setPatients([]);
        toast.error(err.response?.data?.message || "Error fetching patients");
      }

      // Fetch doctors
      let doctorsRes;
      try {
        doctorsRes = await axios.get(`${BASE_URL}/admin/doctors`, { headers });
        if (doctorsRes.data?.success) {
          const doctorsData = doctorsRes.data.doctors || doctorsRes.data.data || [];
          const sortedDoctors = doctorsData.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB - dateA;
          });
          setDoctors(sortedDoctors);
        } else {
          setDoctors([]);
          toast.error(doctorsRes.data.message || "Failed to fetch doctors");
        }
      } catch (err) {
        setDoctors([]);
        toast.error(err.response?.data?.message || "Error fetching doctors");
      }

      // Fetch appointments
      let appointmentsRes;
      try {
        appointmentsRes = await axios.get(`${BASE_URL}/appointments/all`, { headers });
        if (appointmentsRes.data?.success) {
          setAppointments(appointmentsRes.data.data || []);
        } else {
          setAppointments([]);
          toast.error(appointmentsRes.data.message || "Failed to fetch appointments");
        }
      } catch (err) {
        setAppointments([]);
        toast.error(err.response?.data?.message || "Error fetching appointments");
      }

    } catch (error) {
      setError(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchData();
  }, [token, navigate]);

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      await axios.delete(`${BASE_URL}/admin/doctors/${id}`, { headers });
      fetchData();
      toast.success('Doctor deleted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete doctor");
    }
  };

  const handleApproveDoctor = async (id) => {
    if (!window.confirm("Are you sure you want to approve this doctor?")) return;
    try {
      const response = await axios.put(
        `${BASE_URL}/admin/doctors/${id}/approve`,
        {},
        { headers }
      );
      fetchData();
      toast.success("Doctor approved successfully!");
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        toast.error("Session expired. Please log in again.");
      } else {
        toast.error(err.response?.data?.message || "Failed to approve doctor");
      }
    }
  };

  const handleDeletePatient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    try {
      console.log('Deleting patient ID:', id);
      const response = await axios.post(
        `${BASE_URL}/admin/patients/${id}`,
        { action: "delete" },
        { headers }
      );
      toast.success(response.data.message);
      fetchData();
    } catch (err) {
      console.error('Delete error:', err.response?.data);
      toast.error(err.response?.data?.message || "Failed to delete patient");
    }
  };

  const filteredDoctors = doctors.filter(doctor => {
    if (statusFilter === 'all') return true;
    return doctor.approvalStatus === statusFilter;
  });

  const filteredAppointments = appointments.filter(appointment => {
    if (appointmentStatusFilter === 'all') return true;
    return appointment.status === appointmentStatusFilter;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) return (
    <div className="text-center my-5">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );

  if (error) return (
    <Alert variant="danger" className="text-center my-5">
      {error}
      <Button variant="outline-danger" onClick={fetchData} className="ms-3">
        Retry
      </Button>
    </Alert>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <Container className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <Button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/login");
            }}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
          >
            Logout
          </Button>
        </Container>
      </header>
      
      <Container className="py-6">
        <Tabs defaultActiveKey="patients" id="admin-tabs" className="mb-4 border-b-2 border-blue-600" fill>
          <Tab
            eventKey="patients"
            title={<span className="text-lg font-medium">Patients ({patients.length})</span>}
            className="p-4 bg-white rounded-lg shadow-sm mt-2"
          >
            {patients.length === 0 ? (
              <Alert variant="info">No patients found</Alert>
            ) : (
              <Table striped bordered hover responsive className="bg-white rounded-lg">
                <thead className="bg-gray-200">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Gender</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p, index) => (
                    <tr key={p._id}>
                      <td>{index + 1}</td>
                      <td>{p.name}</td>
                      <td>{p.email}</td>
                      <td>{p.gender || '-'}</td>
                      <td>
                        {p.createdAt ? new Date(p.createdAt).toLocaleString() : '-'}
                      </td>
                      <td>
                        <div className="d-flex flex-column align-items-center">
                          <FaTrash
                            className="text-danger"
                            style={{ cursor: 'pointer', fontSize: '1.2rem' }}
                            title="Delete"
                            aria-label="Delete patient"
                            onClick={() => handleDeletePatient(p._id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Tab>

          <Tab
            eventKey="doctors"
            title={<span className="text-lg font-medium">Doctors ({doctors.length})</span>}
            className="p-4 bg-white rounded-lg shadow-sm mt-2"
          >
            <Form.Group className="mb-3">
              <Form.Label>Filter by Status:</Form.Label>
              <Form.Select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </Form.Select>
            </Form.Group>

            {filteredDoctors.length === 0 ? (
              <Alert variant="info">No doctors found</Alert>
            ) : (
              <Table striped bordered hover responsive className="bg-white rounded-lg">
                <thead className="bg-gray-200">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Specialization</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDoctors.map((d, index) => (
                    <tr key={d._id}>
                      <td>{index + 1}</td>
                      <td>{d.name}</td>
                      <td>{d.email}</td>
                      <td>{d.specialization || '-'}</td>
                      <td>{d.approvalStatus || 'Pending'}</td>
                      <td>
                        {d.createdAt ? new Date(d.createdAt).toLocaleString() : '-'}
                      </td>
                      <td>
                        <div className="d-flex flex-column align-items-center">
                          {d.approvalStatus !== 'approved' && (
                            <FaCheck
                              className="text-success mb-2"
                              style={{ cursor: 'pointer', fontSize: '1.2rem' }}
                              title="Approve"
                              aria-label="Approve doctor"
                              onClick={() => handleApproveDoctor(d._id)}
                            />
                          )}
                          <FaTrash
                            className="text-danger"
                            style={{ cursor: 'pointer', fontSize: '1.2rem' }}
                            title="Delete"
                            aria-label="Delete doctor"
                            onClick={() => handleDeleteDoctor(d._id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Tab>

          <Tab
            eventKey="appointments"
            title={<span className="text-lg font-medium">Appointments ({appointments.length})</span>}
            className="p-4 bg-white rounded-lg shadow-sm mt-2"
          >
            <Form.Group className="mb-3">
              <Form.Label>Filter by Status:</Form.Label>
              <Form.Select 
                value={appointmentStatusFilter} 
                onChange={(e) => setAppointmentStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </Form.Select>
            </Form.Group>

            {filteredAppointments.length === 0 ? (
              <Alert variant="info">No appointments found</Alert>
            ) : (
              <Table striped bordered hover responsive className="bg-white rounded-lg">
                <thead className="bg-gray-200">
                  <tr>
                    <th>#</th>
                    <th>Patient Name</th>
                    <th>Doctor Name</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.map((appointment, index) => (
                    <tr key={appointment._id}>
                      <td>{index + 1}</td>
                      <td>{appointment.patient?.name || '-'}</td>
                      <td>{appointment.doctor?.name || '-'}</td>
                      <td>{appointment.date ? formatDate(appointment.date) : '-'}</td>
                      <td>{appointment.time || '-'}</td>
                      <td>{appointment.status || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};

export default AdminDashboard;