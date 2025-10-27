import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import { BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";

const ProfileEdit = () => {
  const [profile, setProfile] = useState({ name: "", email: "", phone: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch the current profile data
  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (!token) {
        setError("You must be logged in to edit your profile");
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
        const { name, email, phone } = res.data.data;
        setProfile({ name, email, phone: phone || "" });
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
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission to update the profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (!token) {
        setError("You must be logged in to update your profile");
        navigate("/login");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const res = await axios.put(`${BASE_URL}/patients/profile/me`, profile, config);
      if (res.data.success) {
        setSuccess("Profile updated successfully");
        setTimeout(() => navigate("/patient-dashboard"), 1500); // Redirect back to dashboard after 1.5s
      } else {
        setError(res.data.message || "Failed to update profile");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Error updating profile";
      setError(errorMessage);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <Container className="my-5">
      <Card>
        <Card.Body>
          <Card.Title>Edit Profile</Card.Title>
          {loading && <p>Loading...</p>}
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                required
                placeholder="Enter your name"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPhone">
              <Form.Label>Phone (Optional)</Form.Label>
              <Form.Control
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate("/patient-dashboard")}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProfileEdit;