'use client';
import React, { useState, useEffect } from 'react';
import { ProductType, SkinConcern, SkinType } from '@/constants';
import { StoreProps } from '@/types/firebasetypes';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';

export const updateSearchParams = (type: string, value: string) => {
  const searchParams = new URLSearchParams('');
  searchParams.set(type, value);
  const newPathname = `${window.location.pathname}?${searchParams.toString()}`;
  return newPathname;
};

const SearchFilter = ({ searchParams }: StoreProps) => {
  const router = useRouter();

  const [selectedSkinType, setSelectedSkinType] = useState<string | null>(null);
  const [selectedProductType, setSelectedProductType] = useState<string | null>(null);
  const [selectedSkinConcern, setSelectedSkinConcern] = useState<string | null>(null);

  const [isSkinTypeOpen, setIsSkinTypeOpen] = useState(false);
  const [isProductTypeOpen, setIsProductTypeOpen] = useState(false);
  const [isSkinConcernOpen, setIsSkinConcernOpen] = useState(false);

  useEffect(() => {
    setSelectedSkinType(searchParams.skinType || null);
    setSelectedProductType(searchParams.category || null);
    setSelectedSkinConcern(searchParams.skinConcern || null);
  }, [searchParams]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams as any);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    const newPathname = `${window.location.pathname}?${params.toString()}`;
    router.push(newPathname);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center gap-5 px-4 py-4 border-t border-b border-gray-300 my-8 bg-gray-50">
      {/* Skin Type Dropdown */}
      <div className="relative w-full sm:w-auto">
        <button
          onClick={() => setIsSkinTypeOpen((prev) => !prev)}
          className="flex items-center justify-between text-gold-500 hover:text-gold-600 transition border rounded px-4 py-2 w-full sm:w-40"
        >
          <span>{selectedSkinType || 'Skin Type'}</span>
          <ChevronDown className="text-black w-4 h-4" />
        </button>
        {isSkinTypeOpen && (
          <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-md w-full z-10">
            <div className="p-2">
              {SkinType.map((type) => (
                <div
                  key={type}
                  onClick={() => {
                    setSelectedSkinType(type);
                    updateFilter('skinType', type);
                    setIsSkinTypeOpen(false);
                  }}
                  className="hover:bg-gray-100 px-4 py-2 rounded-md cursor-pointer"
                >
                  {type}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Product Type Dropdown */}
      <div className="relative w-full sm:w-auto">
        <button
          onClick={() => setIsProductTypeOpen((prev) => !prev)}
          className="flex items-center justify-between text-gold-500 hover:text-gold-600 transition border rounded px-4 py-2 w-full sm:w-40"
        >
          <span>{selectedProductType || 'Product Type'}</span>
          <ChevronDown className="text-black w-4 h-4" />
        </button>
        {isProductTypeOpen && (
          <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-md w-full z-10">
            <div className="p-2">
              {ProductType.map((type) => (
                <div
                  key={type}
                  onClick={() => {
                    setSelectedProductType(type);
                    updateFilter('category', type);
                    setIsProductTypeOpen(false);
                  }}
                  className="hover:bg-gray-100 px-4 py-2 rounded-md cursor-pointer"
                >
                  {type}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Skin Concern Dropdown */}
      <div className="relative w-full sm:w-auto">
        <button
          onClick={() => setIsSkinConcernOpen((prev) => !prev)}
          className="flex items-center justify-between text-gold-500 hover:text-gold-600 transition border rounded px-4 py-2 w-full sm:w-40"
        >
          <span>{selectedSkinConcern || 'Skin Concern'}</span>
          <ChevronDown className="text-black w-4 h-4" />
        </button>
        {isSkinConcernOpen && (
          <div className="absolute left-0 mt-2 bg-white shadow-lg rounded-md w-full z-10">
            <div className="p-2">
              {SkinConcern.map((concern) => (
                <div
                  key={concern}
                  onClick={() => {
                    setSelectedSkinConcern(concern);
                    updateFilter('skinConcern', concern);
                    setIsSkinConcernOpen(false);
                  }}
                  className="hover:bg-gray-100 px-4 py-2 rounded-md cursor-pointer"
                >
                  {concern}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;
