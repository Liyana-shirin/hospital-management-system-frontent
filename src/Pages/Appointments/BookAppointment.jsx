import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert, Card } from "react-bootstrap";
import axios from "axios";
import { BASE_URL } from "../../config";
import { useNavigate, useParams } from "react-router-dom";

const BookAppointment = () => {
  const [doctor, setDoctor] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    purpose: "",
    preferredDate: "",
    preferredTime: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState({
    doctor: true,
    booking: false,
  });
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { doctorId } = useParams();

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        setLoading((prev) => ({ ...prev, doctor: true }));
        const res = await axios.get(`${BASE_URL}/doctors/${doctorId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (res.data.success) {
          setDoctor(res.data.data);
        } else {
          setError(res.data.message || "Doctor not found");
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Error loading doctor information";
        setError(errorMessage);

        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login", { state: { from: `/book-appointment/${doctorId}` } });
        }
      } finally {
        setLoading((prev) => ({ ...prev, doctor: false }));
      }
    };

    if (doctorId) {
      fetchDoctor();
    } else {
      setError("No doctor ID provided");
      setLoading((prev) => ({ ...prev, doctor: false }));
    }
  }, [doctorId, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading((prev) => ({ ...prev, booking: true }));

    if (!token) {
      setError("You must be logged in to book an appointment");
      setLoading((prev) => ({ ...prev, booking: false }));
      navigate("/login", { state: { from: `/book-appointment/${doctorId}` } });
      return;
    }

    if (!formData.fullName || !formData.phone || !formData.purpose || !formData.preferredDate || !formData.preferredTime) {
      setError("All required fields must be filled");
      setLoading((prev) => ({ ...prev, booking: false }));
      return;
    }

    if (!/^\d{10}$/.test(formData.phone)) {
      setError("Phone number must be 10 digits");
      setLoading((prev) => ({ ...prev, booking: false }));
      return;
    }

    const appointmentDate = new Date(formData.preferredDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (appointmentDate < today) {
      setError("Appointment date must be today or in the future");
      setLoading((prev) => ({ ...prev, booking: false }));
      return;
    }

    const [hours] = formData.preferredTime.split(":").map(Number);
    if (hours < 8 || hours >= 20) {
      setError("Appointments can only be scheduled between 8 AM and 8 PM");
      setLoading((prev) => ({ ...prev, booking: false }));
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/appointments`,
        {
          doctorId: doctorId,
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email || undefined,
          purpose: formData.purpose,
          date: formData.preferredDate,
          time: formData.preferredTime,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        setSuccess("Appointment booked successfully!");
        setFormData({
          fullName: "",
          phone: "",
          email: "",
          purpose: "",
          preferredDate: "",
          preferredTime: "",
        });
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setError(res.data.message || "Failed to book appointment");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to book appointment";
      setError(errorMessage);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login", { state: { from: `/book-appointment/${doctorId}` } });
      }
    } finally {
      setLoading((prev) => ({ ...prev, booking: false }));
    }
  };

  if (loading.doctor) {
    return (
      <Container className="my-5 text-center">
        <h2>Loading doctor information...</h2>
      </Container>
    );
  }

  if (!doctor) {
    return (
      <Container className="my-5 text-center">
        <h2>Doctor not found</h2>
        <p className="text-danger">{error}</p>
        <Button variant="primary" onClick={() => navigate("/find-doctors")}>
          Go Back to Find Doctors
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h5 className="mb-2 fw-bold">Book an Appointment</h5>

      <Card className="mb-4 text-bg-light shadow-sm">
        <Card.Body>
          <Card.Title className="mb-3">Doctor Information</Card.Title>
          <div className="text-start">
            <h5 className="fw-bold">Dr. {doctor.name}</h5>
            <p><strong>Specialization:</strong> {doctor.specialization || "Not specified"}</p>
            {doctor.email && <p><strong>Email:</strong> {doctor.email}</p>}
          </div>
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Body>
          <Card.Title className="mb-4">Appointment Details</Card.Title>
          {error && <Alert variant="danger" dismissible onClose={() => setError("")}>{error}</Alert>}
          {success && <Alert variant="success" dismissible onClose={() => setSuccess("")}>{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col xs={12} md={6}>
                <Form.Group controlId="fullName">
                  <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    disabled={loading.booking}
                    placeholder="Enter your full name"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group controlId="phone">
                  <Form.Label>Phone Number <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{10}"
                    title="Please enter a 10-digit phone number"
                    disabled={loading.booking}
                    placeholder="Enter your 10-digit phone number"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group controlId="email">
                  <Form.Label>Email (Optional)</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading.booking}
                    placeholder="Enter your email (optional)"
                  />
                </Form.Group>
              </Col>
              <Col xs={12}>
                <Form.Group controlId="purpose">
                  <Form.Label>Purpose of Visit <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    required
                    disabled={loading.booking}
                    placeholder="Describe the purpose of your visit"
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group controlId="preferredDate">
                  <Form.Label>Preferred Date <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="date"
                    name="preferredDate"
                    value={formData.preferredDate}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split("T")[0]}
                    disabled={loading.booking}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={6}>
                <Form.Group controlId="preferredTime">
                  <Form.Label>Preferred Time <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="time"
                    name="preferredTime"
                    value={formData.preferredTime}
                    onChange={handleChange}
                    required
                    disabled={loading.booking}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} className="text-center mt-4">
                <Button 
                  variant="primary"
                  type="submit"
                  disabled={loading.booking || !doctor}
                  className="px-5 py-2 "
                >
                  {loading.booking ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Booking...
                    </>
                  ) : "Book Appointment"}
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BookAppointment;