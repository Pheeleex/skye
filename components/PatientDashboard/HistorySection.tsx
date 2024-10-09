// components/dashboard/HistorySection.tsx
const HistorySection = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Appointment History</h2>
        {/* Replace with actual appointment history data */}
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg border">
            <h3 className="font-medium">Eye Examination</h3>
            <p className="text-sm text-gray-600">September 2nd, 2024 at 1:00 PM</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border">
            <h3 className="font-medium">Annual Physical</h3>
            <p className="text-sm text-gray-600">August 15th, 2024 at 10:00 AM</p>
          </div>
        </div>
      </div>
    );
  };
  
  export default HistorySection;
  