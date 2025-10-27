import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Badge, Card, Button, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const FindDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("");
  const [userRole, setUserRole] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user role from localStorage (set during login)
    const role = localStorage.getItem("role");
    setUserRole(role || "");

    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:5000/api/v1/admin/doctors/approved", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const fetchedDoctors = response.data.doctors || [];
        setDoctors(fetchedDoctors);
        setFilteredDoctors(fetchedDoctors);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching approved doctors:", err);
        setError("Failed to fetch approved doctors. Please try again.");
        setLoading(false);
        toast.error("Error fetching approved doctors");
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    const filterDoctors = () => {
      let filtered = doctors;

      if (searchTerm) {
        filtered = filtered.filter(
          (doctor) =>
            doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (specializationFilter) {
        filtered = filtered.filter((doctor) =>
          doctor.specialization.toLowerCase().includes(specializationFilter.toLowerCase())
        );
      }

      setFilteredDoctors(filtered);
    };

    filterDoctors();
  }, [searchTerm, specializationFilter, doctors]);

  const handleBookAppointment = (doctorId) => {
    navigate(`/book-appointment/${doctorId}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container my-4">
      <h1 className="text-2xl font-bold mb-4">Approved Doctors</h1>

      <Form className="mb-4">
        <Row>
          <Col md={6}>
            <Form.Group controlId="searchTerm">
              <Form.Label>Search by Name or Email</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name or email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId="specializationFilter">
              <Form.Label>Filter by Specialization</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter specialization"
                value={specializationFilter}
                onChange={(e) => setSpecializationFilter(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>

      {filteredDoctors.length === 0 ? (
        <p>No approved doctors found</p>
      ) : (
        <Row>
          {filteredDoctors.map((doctor) => (
            <Col md={4} key={doctor._id} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>Dr. {doctor.name}</Card.Title>
                  <Card.Subtitle className="mb-3 text-muted">{doctor.specialization}</Card.Subtitle>
                  <Card.Text>
                    <strong>Email:</strong> {doctor.email}
                    <br />
                    <strong>Phone:</strong> {doctor.phone || "N/A"}
                    <br />
                  </Card.Text>
                  {userRole === "patient" && (
                    <Button
                      variant="primary"
                      onClick={() => handleBookAppointment(doctor._id)}
                    >
                      Book Appointment
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default FindDoctors;