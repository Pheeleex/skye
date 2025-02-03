import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { getAppointment } from "@/lib/actions/appointments.actions";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface SearchParamProps {
  params: { userId: string };
  searchParams?: { appointmentId?: string };
}

const page = async ({ params: { userId }, searchParams }: SearchParamProps) => {
  const id = (searchParams?.appointmentId as string) || "";
  const appointment = await getAppointment(userId);

  if (!appointment) {
    return <p className="text-center py-12">No appointment found for this user.</p>;
  }

  const doctor = Doctors.find((doc) => doc.name === appointment.primaryPhysician);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-5 py-10">
      <div className="bg-white shadow-lg rounded-xl w-full max-w-2xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Link href="/">
            <Image
              src="/assets/icons/logo-full.svg"
              alt="logo"
              width={150}
              height={150}
              className="h-10 w-auto"
            />
          </Link>
        </div>

        {/* Success Message */}
        <section className="flex flex-col items-center text-center mb-8">
          <Image
            src="/assets/gifs/success.gif"
            alt="Success"
            width={280}
            height={300}
            className="mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Your <span className="text-green-500">appointment request</span> has been successfully submitted!
          </h2>
          <p className="text-gray-600">We&apos;ll be in touch shortly to confirm.</p>
        </section>

        {/* Appointment Details */}
        <section className="mb-8">
          <p className="text-lg font-medium text-gray-700 mb-3">Requested appointment details:</p>
          <div className="flex items-center gap-4 mb-3">
            {doctor && (
              <>
                <Image
                  src={doctor.image}
                  alt="Doctor"
                  width={60}
                  height={60}
                  className="rounded-full"
                />
                <p className="text-gray-800 font-semibold whitespace-nowrap">
                  Dr. {doctor.name}
                </p>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Image
              src="/assets/icons/calendar.svg"
              alt="Calendar"
              width={24}
              height={24}
            />
            <p className="text-gray-700">{formatDateTime(appointment.schedule).dateTime}</p>
          </div>
        </section>

        {/* Additional Details Prompt */}
        <p className="text-gray-600 mb-6">
          Would you like to create a folder with us to help serve you better? Click below to add details about yourself – it will only take a few minutes.
        </p>

        <Button variant="outline" className="w-full mb-6" asChild>
          <Link href={`/patients/${userId}/details`}>Add details</Link>
        </Button>

        <p className="text-center text-gray-500 text-sm">© 2024 CarePluse</p>
      </div>
    </div>
  );
};

export default page;
