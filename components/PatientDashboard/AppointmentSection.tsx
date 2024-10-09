// components/dashboard/AppointmentSection.tsx
const AppointmentSection = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
        {/* Replace this with actual appointment data */}
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg border">
            <h3 className="font-medium">Check-up with Dr. Smith</h3>
            <p className="text-sm text-gray-600">October 5th, 2024 at 10:30 AM</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border">
            <h3 className="font-medium">Dental Cleaning</h3>
            <p className="text-sm text-gray-600">November 12th, 2024 at 2:00 PM</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default AppointmentSection;
  