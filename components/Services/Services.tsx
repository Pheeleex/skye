import React from 'react';
import { academy, products, treatment } from '@/public';
import Link from 'next/link';
import Treatments from './Treatments';

const Services = () => {
  const services = [
    {
      image: treatment,
      title: 'SMAC TREATMENTS',
      description: 'Explore our range of effective treatments designed to enhance your well-being.',
      link: '/treatment'
    },
    {
      image: products,
      title: 'SMAC PRODUCTS',
      description: 'Discover our premium products that support your health and beauty needs.',
      link: '/products'
    },
    {
      image: academy,
      title: 'SMAC ACADEMY',
      description: 'Join our academy to learn about wellness and beauty techniques from experts.',
      link: '/academy'
    }
  ];

  return (
    <>
      <section className="py-20 gold-layout mt-16" aria-labelledby="services-heading">
        <h2 className="text-center text-3xl font-bold mb-10" id="services-heading">
          Our Services
        </h2>
        <div className="flex flex-col lg:flex-row justify-center items-center gap-8 max-w-6xl mx-auto px-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="card w-full max-w-xs h-[25rem] bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105 flex flex-col"
            >
              <img
                src={service.image.src}
                alt={service.title}
                className="w-full h-1/2 object-cover"
              />
              <div className="p-6  flex flex-col justify-between h-1/2">
                <h3 className="text-xl text-gold-400 font-semibold mb-2">{service.title}</h3>
                <p className="text-gold-400 mb-4">{service.description}</p>
                <Link href={service.link} passHref>
                  <span className="inline-block text-white bg-deep_purple hover:bg-purple-700 transition duration-300 px-4 py-2 rounded-md cursor-pointer">
                    Learn More
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Treatments />
    </>
  );
};

export default Services;

