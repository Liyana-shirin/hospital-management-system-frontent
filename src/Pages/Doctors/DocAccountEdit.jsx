import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config";
import { toast } from "react-toastify";

const EditDoctorProfile = () => {
  const [doctor, setDoctor] = useState({
    name: "",
    email: "",
    specialization: "",
    phone: "",
    qualifications: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!token) {
          setError("You must be logged in to edit your profile");
          navigate("/login");
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const res = await axios.get(`${BASE_URL}/doctors/profile/me`, config);
        if (res.data.success) {
          const { name, email, specialization, phone, qualifications } = res.data.data;
          setDoctor({
            name: name || "",
            email: email || "",
            specialization: specialization || "",
            phone: phone || "",
            qualifications: qualifications || "",
          });
        } else {
          setError("Failed to fetch doctor profile");
        }
      } catch (err) {
        console.error("Error fetching doctor profile:", err);
        const errorMessage = err.response?.data?.message || err.message || "An error occurred while fetching your profile.";
        setError(errorMessage);
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [navigate, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctor((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!token) {
        setError("You must be logged in to update your profile");
        navigate("/login");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const res = await axios.put(`${BASE_URL}/doctors/profile/me`, doctor, config);

      if (res.data.success) {
        toast.success("Profile updated successfully");
        setTimeout(() => navigate("/doctor-dashboard"), 1500); // Redirect after 1.5s to show toast
      } else {
        setError("Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      const errorMessage = err.response?.data?.message || err.message || "An error occurred while updating your profile.";
      setError(errorMessage);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !doctor.name) {
    return <div className="text-center py-10 text-gray-500 text-lg">Loading your profile...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-10">{error}</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">Edit Your Profile</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={doctor.name}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={doctor.email}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg bg-gray-100 cursor-not-allowed"
                required
                disabled
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialization
              </label>
              <input
                type="text"
                name="specialization"
                value={doctor.specialization}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={doctor.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Qualifications
              </label>
              <textarea
                name="qualifications"
                value={doctor.qualifications}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>
            
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">
              </p>
            </div>
          </div>
          
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}
          
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/doctor-dashboard")}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-lg text-white transition-colors ${
                isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDoctorProfile;