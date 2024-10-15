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
    <section className="home mt-0 h-full " aria-labelledby="hero-heading">
      <div className="slide flex flex-col lg:flex-row justify-between items-start h-full ">
        
        {/* Left content section */}
        <motion.div
          initial={{ y: 300 }}
          animate={{ y: isVisible ? [200, 0] : 300 }} // Animate only when isVisible is true
          transition={{ duration: 1.5 }}
          className="flex-1 basis-1/2 p-[2rem] md:p-[6rem] pt-[4rem] h-full flex flex-col gap-4
          justify-start items-center md:justify-center md:items-start 
          gold-layout pb-[2.3rem]"
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
            href='/Products'
            className="btn mt-4 inline-block text-xl deep-purple bg-transparent border border-[#d1b1b1] py-2 px-12 
            hover:text-white hover:bg-[#230e30] transition duration-1000"
          >
            Get started
          </Link>
        </motion.div>

        {/* Right slider section */}
        <div className="flex-1 basis-1/2 h-full">
          <CustomSlider
            items={contentImages}
            width={500}  // Adjust width if needed
            height={500} // Adjust height if needed
            slideContClass="h-full w-full bg-yellow-200"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
