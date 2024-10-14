'use client'

import React from 'react';
import ReviewSlider from './ReviewSlider';
import "./Reviews.css";
import { motion } from 'framer-motion';

const Review = () => {
  const reviews = [
    {
      Comment: `We hired Oyster Properties to renovate our old family 
      home, and the results were amazing. The team was punctual, 
      respectful, and delivered high-quality work on time and within budget. 
      They turned our house into a dream home. 
      Highly recommend their renovation services!`,
      name: 'Mr. Oliver',
      Type: 'Landlord'
    },
    {
      Comment: `As an investor, I've had great success with Oyster Properties.
       Their real estate investment opportunities offer high returns and 
       low risk. The team's communication and transparency throughout 
       the project were exceptional. 
      Highly recommended for real estate investments.`,
      name: 'Mrs. Samir Bilikisu',
      Type: 'Investor'
    },
    {
      Comment: `Renting from Oyster Properties has been a delight. 
      The property is beautiful and well-maintained, and their customer 
      service is outstanding. Any maintenance requests are promptly handled. 
      I highly recommend them for a hassle-free rental experience.`,
      name: 'Mr. Tj Ronnin',
      Type: 'Lease'
    },
    {
      Comment: `As an investor, I've had great success with Oyster Properties. 
      Their real estate investment opportunities offer high returns and 
      low risk. The team's communication and transparency throughout the 
      project were exceptional. 
      Highly recommended for real estate investments.`,
      name: 'Mr. Felix',
      Type: 'Investor'
    },
  ];

  return (
    <div>
      <section className="reviews mt-[12rem]">
        <h2 
          initial={{x: 0}}
          whileInView={{ x: [180, 90, 45, -15]}}
          transition={{duration: 2}}
          className="service-head">Reviews</h2>
        <div className="review-container">
          <div className="sample">
            <h3>Don't just take our word for it</h3>
            <p>
              Our investors are at the heart of what we do – and their
              feedback speaks volumes about the success of our property investment mission. Beautiful homes. Sustainable growth.
            </p>
            <button>Read all reviews</button>
          </div>
          <ReviewSlider reviews={reviews} />
        </div>
      </section>
    </div>
  );
};

export default Review;
