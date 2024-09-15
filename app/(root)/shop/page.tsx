import React from 'react';

const products = [
  {
    id: 1,
    name: 'Acwell Cleanser',
    price: '$24.99',
    image: '/assets/shop-images/acwell-cleanser.png',
  },
  {
    id: 2,
    name: 'acwell-toner',
    price: '$29.99',
    image: '/assets/shop-images/acwell-tone.jpg',
  },
  {
    id: 3,
    name: 'Acewell-Licorice-cleaning-gel-foam',
    price: '$19.99',
    image: '/assets/shop-images/acewell-gel.jpg',
  },
  // Add more products here
];

const Page = () => {
  return (
    <div className="container mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold mb-10 text-center text-gold-500">
        Skincare Products
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center hover:shadow-xl 
            transition-shadow duration-300 border border-gold-200"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md mb-4 "
            />
            <h2 className="text-2xl font-semibold mb-3 text-gray-800">
              {product.name}
            </h2>
            <p className="text-lg font-medium text-gray-600 mb-4">
              {product.price}
            </p>
            <div className="flex gap-4">
              <button className="bg-gold-700 text-white px-6 py-2 rounded-md hover:bg-gold-300 transition-colors">
                Add to Cart
              </button>
              <button className="border border-gold-500 text-gold-500 px-6 py-2 rounded-md hover:bg-gold-500 
              hover:text-white transition-colors">
                View Product
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
