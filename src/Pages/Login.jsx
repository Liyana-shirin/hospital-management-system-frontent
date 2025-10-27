import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../config.js";
import { toast } from "react-toastify";
import { AuthContext } from "../Context/authContext.jsx";
import HashLoader from "react-spinners/HashLoader";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    console.log("Request URL:", `${BASE_URL}/login`); 
    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.log("Response Error:", errorText); // Debug response
        throw new Error(`HTTP error! Status: ${res.status}, Message: ${errorText}`);
      }

      const result = await res.json();
      console.log("Response Data:", result); // Debug response data

      if (!result.success) {
        throw new Error(result.message || "Login failed");
      }

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { user: result.data, token: result.token, role: result.role },
      });
      localStorage.setItem("role", result.role);

      const userRole = result.role;
      if (userRole === "admin" || userRole === "doctor" || userRole === "patient") {
        toast.success(result.message);
        navigate("/home");
      } else {
        throw new Error("Unauthorized role");
      }
    } catch (err) {
      toast.error(err.message);
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-5 lg:px-0 flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-[570px] mx-auto bg-white rounded-lg shadow-md p-6 md:p-10">
        <h3 className="text-headingColor text-[22px] leading-9 font-bold mb-6 text-center">
          Hello! <span className="text-primaryColor">Welcome</span> Back 👋
        </h3>
        <form className="space-y-4 md:py-0" onSubmit={submitHandler}>
          <div>
            <input
              type="email"
              placeholder="Enter Your Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Enter Your Password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primaryColor"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primaryColor text-white py-3 rounded-lg font-bold hover:bg-primaryDark transition"
            disabled={loading}
          >
            {loading ? <HashLoader size={25} color="#fff" /> : "Login"}
          </button>
        </form>
        <p className="mt-5 text-center text-textColor">
          Don't have an account?{" "}
          <Link to="/register" className="text-primaryColor font-bold hover:underline">
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;