'use client';

import React, { useState, useEffect } from 'react';
import Image, { StaticImageData } from 'next/image';

// Define prop types for CustomSlider
interface CustomSliderProps {
  items: (string | StaticImageData)[]; // array of image URLs
  width: number; // image width
  height: number; // image height
  slideImgClass?: string; // optional class for the image
  slideContClass?: string; // optional class for the container
  largeCont?: string; // optional class for large container
}

const dotsContainerStyles = "absolute bottom-4 w-full flex justify-center top-[75%]";
const dotStyle = "mx-1 cursor-pointer w-2 h-2 rounded-full bg-gray-400";
const activeDotStyle = "bg-red-600";

const CustomSlider: React.FC<CustomSliderProps> = ({
  items,
  width,
  height,
  slideImgClass = "", // provide default empty string
  slideContClass = "", // provide default empty string
  largeCont = "" // provide default empty string
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  // Change image every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [items.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className={`${largeCont} h-full w-full relative flex `}>
      <div className={`image ${slideContClass} flex w-full h-full overflow-hidden`}>
        {items.map((url, index) => (
          <Image
            src={items[currentIndex]} 
            alt={`Slide ${index + 1}`}
            className={`slide-img ${slideImgClass} h-full w-full`}
            style={{ translate: `${-100 * currentIndex}%` }}
            aria-hidden={currentIndex !== index}
            key={index}
            width={width}
            height={height}
          />
        ))}
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

