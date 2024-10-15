import { fetchPatientById } from "@/lib/actions/patients.actions";
import AppointmentSection from "./AppointmentSection";
import Header from "./Header";
import HistorySection from "./HistorySection";
import PrescriptionSection from "./PrescriptionSection";
import Sidebar from "./SideBar";
import { Appointment } from "@/types/firebasetypes";

const PatientDashboard = (
  {
    patient, 
    userAppointment
  }: {
      patient: PatientDetailsParams,
      userAppointment: Appointment[]
}) => {
  console.log(userAppointment, 'patient dashboard')
    return (
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar
        patient={patient} />
  
        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header patient={patient} />
  
          {/* Dashboard sections */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {/* Appointments */}
            <AppointmentSection 
              patient={patient}
              userAppointment={userAppointment}
              />
  
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