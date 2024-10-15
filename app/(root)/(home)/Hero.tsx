'use client';

import Image from "next/image";
import Link from "next/link";
import { motion } from 'framer-motion';
import CustomSlider from "@/components/CustomSlider";
import { skin2, theSkin } from "@/public";

const Hero = () => {
  const contentImages = [skin2, theSkin]; 

  return (
    <section className="home mt-0  h-full" aria-labelledby="hero-heading">
      <div className="slide flex flex-col lg:flex-row justify-between items-center   h-full">
        
        {/* Left content section */}
        <motion.div
          initial={{ y: 300 }}
          whileInView={{ y: [200, -40, 0] }}
          transition={{ duration: 1.5 }}
          className="flex-1 basis-1/2 pl-[1.4rem] p-[6rem] h-full flex flex-col gap-2 justify-center items-start gold-layout"
        >
          <span className="text-yellow-900 text-2xl">Treatment plans</span>
          <h3 className="deep-purple text-5xl font-bold"> 
            The Science of feeling good.
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
            height={300} // Adjust height if needed
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
