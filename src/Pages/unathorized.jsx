import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const Unauthorized = () => {
  return (
    <Container>
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-red-600">Unauthorized Access</h1>
        <p className="mt-4 text-gray-600">You do not have permission to view this page.</p>
        <Link to="/login" className="mt-4 inline-block text-blue-600 hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
    </Container>
  );
};

export default Unauthorized;