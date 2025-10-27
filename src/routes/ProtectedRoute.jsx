import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../Context/authContext.jsx";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { state } = useContext(AuthContext);
  const { token, role, user } = state; // Destructure from state

  console.log("ProtectedRoute Debugging:");
  console.log("Token:", token);
  console.log("Role:", role);
  console.log("User:", user);
  console.log("Allowed Roles:", allowedRoles);

  // Check if token exists
  if (!token) {
    console.warn("Access Denied: No token found.");
    return <Navigate to="/login" replace />;
  }

  // Check if role is allowed (if allowedRoles is provided)
  const normalizedRole = role?.toLowerCase() || "";
  const normalizedAllowedRoles = allowedRoles?.map((r) => r.toLowerCase()) || [];
  if (normalizedAllowedRoles.length > 0 && !normalizedAllowedRoles.includes(normalizedRole)) {
    console.warn("Access Denied: Role not allowed. Redirecting to unauthorized.");
    return <Navigate to="/unauthorized" replace />;
  }

  console.log("Access granted.");
  return children;
};

export default ProtectedRoute;