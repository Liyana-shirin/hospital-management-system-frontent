import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import signupImg from "../assets/images/signupImg.png";
import { BASE_URL } from "../../src/config.js";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    gender: "",
    phone: "",
    specialization: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/register`, formData);
      toast.success(res.data.message || "Signup successful");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  const { name, email, password, role, gender, phone, specialization } = formData;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Toaster />
      <div className="flex flex-col md:flex-row bg-white rounded-xl shadow-xl overflow-hidden max-w-5xl w-full">

        {/* Left Image Section */}
        <div className="md:w-1/2 bg-blue-100 flex items-center justify-center hidden md:flex p-6">
          <img src={signupImg} alt="Signup" className="w-full h-auto object-contain" />
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">Create an Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              name="name"
              value={name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="input"
            />

            <input
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="input"
              
            />

            <input
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="input"
            />

            <select name="role" value={role} onChange={handleChange} required className="input">
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="admin">Admin</option>
            </select>

            <select name="gender" value={gender} onChange={handleChange} className="input">
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <input
              type="text"
              name="phone"
              value={phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="input"
            />

            {role === "doctor" && (
              <input
                type="text"
                name="specialization"
                value={specialization}
                onChange={handleChange}
                placeholder="Specialization"
                className="input"
              />
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
