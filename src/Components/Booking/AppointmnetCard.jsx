import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import axios from "axios";
import { BASE_URL } from "../config";

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BASE_URL}/appointments`,
        { doctorId, date, time },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        navigate("/doctor-dashboard"); // Redirect to dashboard or confirmation page
      } else {
        throw new Error("Failed to book appointment");
      }
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <Container className="my-5">
      <h2>Book Appointment</h2>
      {error && <p className="text-danger">{error}</p>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Date</Form.Label>
          <Form.Control
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Time</Form.Label>
          <Form.Control
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Book Now
        </Button>
      </Form>
    </Container>
  );
};

export default BookAppointment;