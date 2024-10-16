import Image from "next/legacy/image";
import DetailsForm from "@/components/forms/DetailsForm";
import { getAppointment } from "@/lib/actions/appointments.actions";


const PatientDetails = async ({ params: { userId } }: SearchParamProps) => {
 const user = await getAppointment(userId)
  console.log(user)
 

  return (
    <div className="flex-col md:flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <DetailsForm user={user!}  />
          <p className="copyright py-12">© 2024 CarePluse</p>
        </div>
      </section>

      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={700}
        alt="patient"
        className="side-img max-w-[390px]"
      />
    </div>
  );
};

export default PatientDetails;