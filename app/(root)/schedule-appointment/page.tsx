//import PassKeyModal from "@/components/PassKeyModal";
import AppointmentForm from "@/components/forms/AppointmentForm";
import PassKeyModal from "@/components/PassKeyModal";
import Image from "next/legacy/image";
import Link from "next/link";




const Home = ({ searchParams }: SearchParamProps) => {
  const isAdmin = searchParams?.admin === "true";

  return (
    <div className="flex flex-col md:flex-row h-screen max-h-screen">


       {isAdmin && <PassKeyModal /> }


      <section className="remove-scrollbar container my-auto">
        <div className="sub-container  max-w-[600px]">
        <h1 className="mb-12">Returning patient? 
          <Link className="text-yellow-800 ml-2 p-2 font-bold border rounded-md border-yellow-600 "
         href={'./clients'}>Click here</Link> </h1>
        <AppointmentForm
          type="create"
          user="visitor"
         />

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2024 CarePluse
            </p>
            <Link href="/schedule-appointment/?admin=true" className="text-gold-400">
              Admin
            </Link>
          </div>
        </div>
      </section>
     <div className="hidden lg:block">
         <Image
        src="/assets/images/onboarding-img.png"
        height={1000}
        width={500}
        alt="patient"
        className="side-img w-[200px] max-w-[50%] "
      />
     </div>
    </div>
  );
};

export default Home;
