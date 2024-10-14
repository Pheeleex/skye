'use client';
import React, { useState, useEffect } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { ProductType, SkinConcern, SkinType } from '@/constants';
import { StoreProps } from '@/types/firebasetypes';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react'; // Assuming you're using an icon library like Lucide


export const updateSearchParams = (type: string, value: string) => {
  // Get the current URL search params
  const searchParams = new URLSearchParams('');

  // Set the specified search parameter to the given value
  searchParams.set(type, value);

  // Set the specified search parameter to the given value
  const newPathname = `${window.location.pathname}?${searchParams.toString()}`;

  return newPathname;
};

const SearchFilter = ({ searchParams }: StoreProps) => {
  const router = useRouter();

  // State variables for selected values
  const [selectedSkinType, setSelectedSkinType] = useState<string | null>(null);
  const [selectedProductType, setSelectedProductType] = useState<string | null>(null);
  const [selectedSkinConcern, setSelectedSkinConcern] = useState<string | null>(null);

  useEffect(() => {
    // Update state based on searchParams
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
    router.push(newPathname, {scroll: false});
  };

  return (
    <div className="flex justify-center items-center gap-10 px-6 py-4 border-t border-b border-gray-300 my-8">
      {/* Skin Type Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center text-gold-500 hover:text-gold-600 transition">
          <span className="mr-2">{selectedSkinType || 'Skin Type'}</span>
          <ChevronDown className="text-black w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white shadow-lg rounded-md p-2">
          <DropdownMenuLabel>Skin Type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {SkinType.map((type) => (
            <DropdownMenuItem
              key={type}
              onClick={() => {
                setSelectedSkinType(type);
                updateFilter('skinType', type);
              }}
              className="hover:bg-gray-100 px-4 py-2 rounded-md transition"
            >
              {type}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Product Type Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center text-gold-500 hover:text-gold-600 transition">
          <span className="mr-2">{selectedProductType || 'Product Type'}</span>
          <ChevronDown className="text-black w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white shadow-lg rounded-md p-2">
          <DropdownMenuLabel>Product Type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {ProductType.map((type) => (
            <DropdownMenuItem
              key={type}
              onClick={() => {
                setSelectedProductType(type);
                updateFilter('category', type);
              }}
              className="hover:bg-gray-100 px-4 py-2 rounded-md transition"
            >
              {type}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Skin Concern Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center text-gold-500 hover:text-gold-600 transition">
          <span className="mr-2">{selectedSkinConcern || 'Skin Concern'}</span>
          <ChevronDown className="text-black w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white shadow-lg rounded-md p-2">
          <DropdownMenuLabel>Skin Concern</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {SkinConcern.map((concern) => (
            <DropdownMenuItem
              key={concern}
              onClick={() => {
                setSelectedSkinConcern(concern);
                updateFilter('skinConcern', concern);
              }}
              className="hover:bg-gray-100 px-4 py-2 rounded-md transition"
            >
              {concern}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SearchFilter;