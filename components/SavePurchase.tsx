'use client'
import React, { useState } from 'react';

interface SavePurchaseProps {
  price: number;
  subscribeSavePrice: string;
}

const SavePurchase: React.FC<SavePurchaseProps> = ({ price, subscribeSavePrice }) => {
  const [selectedOption, setSelectedOption] = useState<'oneTime' | 'subscribe'>('oneTime');

  const handleSelect = (option: 'oneTime' | 'subscribe') => {
    setSelectedOption(option);
  };

  return (
    <div>
      {/* Pricing Options Section */}
      <div className="w-full rounded-md mt-6 border border-gold-400 overflow-hidden">
        <div
          onClick={() => handleSelect('oneTime')}
          className={`flex justify-between p-4 border-b border-gold-400 cursor-pointer ${selectedOption === 'oneTime' ? 'bg-gold-100' : ''}`}
        >
          <span className={`text-gold-700 font-medium ${selectedOption === 'oneTime' ? 'font-bold' : ''}`}>One-Time Purchase</span>
          <span className="text-gold-700 font-semibold">${price}</span>
        </div>
        <div
          onClick={() => handleSelect('subscribe')}
          className={`flex justify-between p-4 cursor-pointer ${selectedOption === 'subscribe' ? 'bg-gold-100' : ''}`}
        >
          <span className={`text-gold-700 font-medium ${selectedOption === 'subscribe' ? 'font-bold' : ''}`}>Subscribe & Save</span>
          <span className="text-gold-700 font-semibold">${subscribeSavePrice}</span>
        </div>
      </div>

      {/* Display additional details if "Subscribe & Save" is selected */}
      {selectedOption === 'subscribe' && (
        <div className="mt-4 p-4 border border-gray-300 rounded-md">
          <h2 className="font-bold text-lg">Benefits of Subscribe & Save:</h2>
          <ul className="list-disc pl-5 mt-2">
            <li>Timely routine delivery based on preference</li>
            <li>Free shipping on all subscriptions</li>
            <li>Save and never run out of your favorite products</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SavePurchase;
