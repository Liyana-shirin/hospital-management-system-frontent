import { useState, useEffect } from 'react';
import { AuthContext } from '../Context/authContext.jsx';

const DoctorDashboard = () => {
  const { user } = AuthContext();
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState({
    appointments: true,
    doctors: true
  });
  const [filter, setFilter] = useState('upcoming');
  const [activeTab, setActiveTab] = useState('appointments'); 
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(`/api/appointments?doctorId=${user._id}&filter=${filter}`);
        const data = await res.json();
        setAppointments(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
        setAppointments([]);
      } finally {
        setLoading(prev => ({ ...prev, appointments: false }));
      }
    };

    const fetchDoctors = async () => {
      try {
        const response = await fetch('/api/doctors');
        const data = await response.json();
        setDoctors(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setDoctors([]);
      } finally {
        setLoading(prev => ({ ...prev, doctors: false }));
      }
    };

    fetchAppointments();
    fetchDoctors();
  }, [filter, user._id]);

  const renderContent = () => {
    if (loading.appointments || loading.doctors) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (activeTab === 'doctors') {
      return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <h2 className="text-xl font-semibold p-4">Available Doctors</h2>
          {doctors.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {doctors.map((doctor) => (
                <li key={doctor._id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-600">
                        {doctor.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {doctor.name} ({doctor.specialization})
                      </div>
                      <div className="text-sm text-gray-500">
                        {doctor.email}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No doctors found</p>
            </div>
          )}
        </div>
      );
    }

    return (
      <>
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-md ${filter === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-4 py-2 rounded-md ${filter === 'past' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Past
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            All Appointments
          </button>
        </div>

        {appointments.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              {/* ... existing appointments table header ... */}
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.map((appointment) => (
                  <AppointmentRow key={appointment._id} appointment={appointment} />
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No appointments found</p>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Dr. {user.name}'s Dashboard
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'appointments' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Appointments
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`py-2 px-4 font-medium text-sm ${activeTab === 'doctors' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Doctors
          </button>
        </div>

        {renderContent()}
      </main>
    </div>
  );
};

// ... keep your existing AppointmentRow component ...

export default DoctorDashboard;