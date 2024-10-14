'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const dotsContainerStyles = "absolute bottom-4 w-full flex justify-center top-[75%]";
const dotStyle = "mx-1 cursor-pointer w-2 h-2 rounded-full bg-gray-400";
const activeDotStyle = "bg-red-600";

const CustomSlider = ({ items, width, height, slideImgClass, slideContClass, largeCont }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

 

  // Change image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [items.length]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className={`home-slider ${largeCont} h-full w-full relative`}>
      <div className={`image ${slideContClass} flex w-full h-full overflow-hidden`}>
      {
          items.map((url, index) => (
            <Image src={items[currentIndex]} alt={`Slide ${index + 1}`}
            className={`slide-img ${slideImgClass}  w-full h-[28rem] object-cover`}
            style={{translate: `${-100 * currentIndex}%`}}
            aria-hidden={currentIndex !== index}
            key={index}
            width={width}
            height={height}
        />
          ))
        }
      </div>
      <div className={dotsContainerStyles}>
        {items.map((_, index) => (
          <div
            key={index}
            onClick={() => goToSlide(index)}
            className={`${dotStyle} ${index === currentIndex ? activeDotStyle : ''}`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentIndex ? 'true' : 'false'}
          />
        ))}
      </div>
    </div>
  );
};

export default CustomSlider;
