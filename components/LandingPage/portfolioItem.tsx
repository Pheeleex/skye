'use client'
import React from 'react'
import { motion } from 'framer-motion';
import Image from 'next/image';

const PortfolioItem = ({ imageSrc, title, description }) => {
    return (
      <div className="sec-01">
        <div className="container">
          <h2 className="main-title">
              We take pride in your satisfaction
              </h2>
          <div className="p-content">
            <div className="p-image">
              <Image src={imageSrc} alt={title} />
            </div>
            <motion.div 
               intial={{x: 0}}
               whileInView={{ x: [-90, 0, -70]}}
               transition={{duration: 2}}
              className="text-box">
              <h3>{title}</h3>
              <p>{description}</p>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }
  
  export default PortfolioItem;