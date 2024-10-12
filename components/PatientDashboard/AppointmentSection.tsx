import { formatDateTime } from "@/lib/utils";
import { Appointment } from "@/types/firebasetypes";

const AppointmentSection = async ({
  patient,
  userAppointment
}: {
  patient: PatientDetailsParams;
  userAppointment: Appointment[];  // Assuming it's an array now
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Upcoming Appointments</h2>

      {/* Check if there are appointments */}
      {userAppointment.length > 0 ? (
        <div className="space-y-4">
          {userAppointment.map((appointment, index) => (
            <div
              key={index}
              className="p-5 bg-gray-50 rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-200"
            >
              <h3 className="font-medium text-lg text-gray-700">
                {appointment.treatment} with Dr. {appointment.primaryPhysician}
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                {formatDateTime(appointment.schedule).dateTime}
              </p>
              <div className="mt-4 flex justify-between items-center">
                <p className="text-xs text-gray-400">
                  Appointment ID: {appointment.id}
                </p>
                <button className="text-blue-500 hover:text-blue-600 font-medium text-sm">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">You have no upcoming appointments.</p>
      )}
    </div>
  );
};

export default AppointmentSection;
