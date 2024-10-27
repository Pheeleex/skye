import SavePurchase from '@/components/SavePurchase';
import { getProduct } from '@/lib/actions/products.actions';
import React from 'react';

const page = async ({ params: { id } }: { params: { id: string } }) => {
  const product = await getProduct(id);

  if (!product) {
    return <div className="text-center text-red-500 mt-10">Product not found</div>;
  }

  const { name, category, description, price, skinConcern, skinType, images, number } = product;

  // Calculate the new price for Subscribe & Save (10% discount)
  const subscribeSavePrice = (price * 0.9).toFixed(2); // 10% discount

  return (
    <div className="flex flex-col md:flex-row items-center p-6 md:p-10 bg-gray-50 min-h-screen">
      {/* Product Details (Left Side) */}
      <div className="md:w-1/2 max-w-lg space-y-4 md:mr-10">
        <h1 className="text-4xl font-extrabold text-gold-400">{name}</h1>
        <div className="flex items-center">
          <span className="ml-2 text-gray-600 text-sm">(4.5/5)</span>
        </div>
        <p className="text-lg font-bold text-gold-600">${price}</p>
        <p className="text-gray-600">{category}</p>
        
        <div className="flex flex-col space-y-2 mt-4">
          <div>
            <span className="text-gray-600 font-medium">Skin Type:</span>
            <span className="text-gray-800 ml-2">{skinType}</span>
          </div>
          <div>
            <span className="text-gray-600 font-medium">Skin Concern:</span>
            <span className="text-gray-800 ml-2">{skinConcern}</span>
          </div>
          <div>
            <span className="text-gray-600 font-medium">Stock:</span>
            <span className={`ml-2 font-semibold ${number > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {number > 0 ? `${number} available` : 'Out of stock'}
            </span>
          </div>
        </div>

        <p className="text-gray-700 mt-6">{description}</p>

        {/* New Pricing Options Section */}
        <SavePurchase
            price={price}
            subscribeSavePrice={subscribeSavePrice}
        />

        {/* Add to Cart Button */}
        <button
          className={`mt-6 px-4 py-2 rounded-md font-semibold text-white ${
            number > 0 ? 'bg-gold-400 hover:bg-gold-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={number <= 0}
        >
          {number > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>

      {/* Product Image (Right Side) */}
      <div className="md:w-1/2 mt-6 md:mt-0">
        <img
          src={images && images[0] || '/default-product.jpg'}
          alt={name}
          className="w-full max-w-md rounded-lg shadow-lg object-cover"
        />
      </div>
    </div>
  );
};

export default page;
