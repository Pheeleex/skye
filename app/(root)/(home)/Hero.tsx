'use client';

import Link from "next/link";
import { motion } from 'framer-motion';
import CustomSlider from "@/components/CustomSlider";
import { skin2, theSkin } from "@/public";
import { useEffect, useState } from "react";

const Hero = () => {
  const contentImages = [skin2, theSkin]; 
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set the state to true to trigger the animation once on component mount
    setIsVisible(true);
  }, [])

  return (
    <section className="mt-0 gold-layout h-full" aria-labelledby="hero-heading">
      <div className="flex flex-col lg:flex-row justify-between items-start min-h-[100vh] ">
        
        {/* Left content section */}
        <div
          className="flex-1 basis-1/2 p-[4rem] md:[6rem] h-full flex flex-col gap-4
          justify-start items-center md:justify-center md:items-start 
          "
        >
          <p className="text-yellow-900 text-2xl">Treatment plans</p>
          <h3 className="deep-purple text-5xl font-bold"> 
            The Science of looking good.
          </h3>
          <p className="text-black text-lg p-2 leading-[1.5]">
            Explore urban brilliance<br />
            with Oyster Properties offering a 
            diverse collection of dream homes and dynamic 
            workspaces that redefine luxury living and 
            workspace innovation. 
          </p>
          <Link
            href='/schedule-appointment'
            className="btn mt-4 inline-block text-xl deep-purple bg-transparent border border-[#d1b1b1] py-2 px-12 
            hover:text-white hover:bg-[#230e30] transition duration-1000"
          >
            Book Appointment
          </Link>
        </div>

        {/* Right slider section */}
        <div className="flex-1 basis-1/2 h-full w-full">
          <CustomSlider
            items={contentImages}
            width={700}  // Adjust width if needed
            height={1000} // Adjust height if needed
            slideContClass="h-full w-full bg-yellow-200"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
