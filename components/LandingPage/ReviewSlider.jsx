'use client'

import React, { useState, useEffect } from 'react';
import './Reviews.css';
import { Star } from 'lucide-react';

const dotsContainerStyles = "absolute bottom-4 w-full flex justify-center gap-2";
const dotStyle = "cursor-pointer w-3 h-3 rounded-full bg-gray-400";
const activeDotStyle = "bg-red-600";

const ReviewSlider = ({ reviews }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [reviews.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="review flex-1 relative">
      <div className='w-full overflow-hidden'>
        <div className='flex transition-transform duration-300' style={{ transform: `translateX(${-100 * currentIndex}%)` }}>
          {reviews.map((review, index) => (
            <div className='slid w-full flex-shrink-0' key={index}>
              <div className="stars red_text flex gap-2 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} color='#880808' />
                ))}
              </div>
              <p className='mt-4'>{review.Comment}</p>
              <p className="name">{review.name}, <span>{review.Type}</span></p>
            </div>
          ))}
        </div>
        <div className={dotsContainerStyles}>
          {reviews.map((_, index) => (
            <div
              key={index}
              onClick={() => goToSlide(index)}
              className={`${dotStyle} ${index === currentIndex ? activeDotStyle : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewSlider;