'use client';

import Link from "next/link";
import { motion } from 'framer-motion';
import CustomSlider from "@/components/CustomSlider";
import { skin2, theSkin } from "@/public";
import { useEffect, useState } from "react";
import Image from "next/image";

const Hero = () => {
  const contentImages = [skin2, theSkin]; 
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Set the state to true to trigger the animation once on component mount
    setIsVisible(true);
  }, [])

  return (
    <section className="mt-0 h-full" aria-labelledby="hero-heading">
      <div className="flex flex-col lg:flex-row justify-between items-center h-full">
        
        {/* Left content section */}
        <div
          className="p-[4rem] md:[6rem] h-full flex flex-col gap-4
          justify-between items-center md:justify-center md:items-start 
          flex-1 basis-1/2"
        >
          <p className="text-yellow-900 text-2xl">Treatment plans</p>
          <h3 className="deep-purple text-5xl font-bold"> 
            The Science of looking good.
          </h3>
          <p className="text-black text-lg p-2 leading-[1.5]">
          At Skye Aesthetics,  <br /> we believe beauty is personal. 
          Our expert team combines artistry with science to enhance your natural allure, 
          offering advanced treatments tailored to you. Step into a world where rejuvenation meets relaxation.
          Your journey to timeless beauty starts here." 
          </p>
          <Link
            href='/schedule-appointment'
            className="btn mt-4 inline-block text-xl text-white bg-[#230e30] border border-[#d1b1b1] py-2 px-8 
            hover:text-[#230e30] hover:bg-transparent transition duration-1000 rounded-md"
          >
            Book Appointment
          </Link>
        </div>

       <div className=" h-full  p-8 flex-1 basis-1/2  flex justify-center items-center ">
          <CustomSlider
            items={contentImages}
            width={700}  // Adjust width if needed
            height={800} // Adjust height if needed
            slideImgClass="h-[50%] w-[80%] rounded-xl"
          />
       </div>
      </div>
    </section>
  );
};

export default Hero;
