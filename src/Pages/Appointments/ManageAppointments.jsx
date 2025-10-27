
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const ManageAppointments = () => {
//   const [appointments, setAppointments] = useState([]);

//   useEffect(() => {
//     // Fetch all appointments
//     const fetchAppointments = async () => {
//       try {
//         const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/appointments`);
//         setAppointments(response.data);
//       } catch (error) {
//         console.error("Error fetching appointments:", error);
//       }
//     };
//     fetchAppointments();
//   }, []);

//   // Accept an appointment
//   const handleAccept = async (id) => {
//     try {
      
//       await axios.put(`${process.env.REACT_APP_API_URL}/api/appointments/${id}/accept`);
//       setAppointments((prev) =>
//         prev.map((app) => (app._id === id ? { ...app, status: "approved" } : app))
//       );
//     } catch (error) {
//       console.error("Error accepting appointment:", error);
//     }
//   };

//   // Reject an appointment
//   const handleReject = async (id) => {
//     try {
//       await axios.put(`${process.env.REACT_APP_API_URL}/api/appointments/${id}/reject`);
//       setAppointments((prev) =>
//         prev.map((app) => (app._id === id ? { ...app, status: "cancelled" } : app))
//       );
//     } catch (error) {
//       console.error("Error rejecting appointment:", error);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h2 className="text-xl font-bold mb-4">Manage Appointments</h2>
//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse border border-gray-300">
//           <thead>
//             <tr className="bg-gray-200 text-left">
//               <th className="border p-2">Patient Name</th>
//               <th className="border p-2">Date of Birth</th>
//               <th className="border p-2">Date & Time</th>
//               <th className="border p-2">Phone</th>
//               <th className="border p-2">Message</th>
//               <th className="border p-2">Status</th>
//               <th className="border p-2">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {appointments.map((appointment) => (
//               <tr key={appointment._id} className="text-center border">
//                 <td className="border p-2">{appointment?.user?.name || "N/A"}</td>
//                 <td className="border p-2">{appointment?.user?.dob || "N/A"}</td>
//                 <td className="border p-2">
//                   {appointment.appointmentDate
//                     ? new Date(appointment.appointmentDate).toLocaleString()
//                     : "N/A"}
//                 </td>
//                 <td className="border p-2">{appointment?.user?.phone || "N/A"}</td>
//                 <td className="border p-2">{appointment?.message || "N/A"}</td>
//                 <td
//                   className={`border p-2 font-bold ${
//                     appointment.status === "approved"
//                       ? "text-green-500"
//                       : appointment.status === "cancelled"
//                       ? "text-red-500"
//                       : "text-yellow-500"
//                   }`}
//                 >
//                   {appointment.status}
//                 </td>
//                 <td className="border p-2">
//                   {appointment.status === "pending" && (
//                     <>
//                       <button
//                         onClick={() => handleAccept(appointment._id)}
//                         className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-700"
//                       >
//                         Accept
//                       </button>
//                       <button
//                         onClick={() => handleReject(appointment._id)}
//                         className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
//                       >
//                         Reject
//                       </button>
//                     </>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ManageAppointments;
