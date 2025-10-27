import { BASE_URL } from "../config.js";

// ✅ Fetch Doctors (Admins Only)
export const fetchDoctors = async (token) => {
  try {
    const res = await fetch(`${BASE_URL}/admin/doctors`, {  
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}` 
      },
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch doctors");

    return data; 
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }
};

