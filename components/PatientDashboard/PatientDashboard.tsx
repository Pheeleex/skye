import AppointmentSection from "./AppointmentSection";
import Header from "./Header";
import HistorySection from "./HistorySection";
import PrescriptionSection from "./PrescriptionSection";
import Sidebar from "./SideBar";

const PatientDashboard = () => {
    return (
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar />
  
        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header />
  
          {/* Dashboard sections */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Appointments */}
            <AppointmentSection />
  
            {/* History */}
            <HistorySection />
  
            {/* Prescriptions */}
            <PrescriptionSection />
          </div>
        </div>
      </div>
    );
  };
  
  export default PatientDashboard;