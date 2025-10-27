export const fetchPatients = async (token) => {
    try {
      if (!token) throw new Error("Unauthorized: No token found");
  
      const res = await fetch(`${BASE_URL}/admin/patients`, {  
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch patients");
  
      return data;
    } catch (error) {
      console.error("Error fetching patients:", error);
      return [];
    }
  };
  
  // ✅ Fetch Patients (Doctors Only) - Patients who booked with this doctor
  export const fetchPatientsForDoctor = async (token) => {
    try {
      if (!token) throw new Error("Unauthorized: No token found");
  
      const res = await fetch(`${BASE_URL}/doctors/appointments`, {  
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch patients for doctor");
  
      return data;
    } catch (error) {
      console.error("Error fetching doctor's patients:", error);
      return [];
    }
  };
  
  