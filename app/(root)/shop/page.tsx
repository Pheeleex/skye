"use client";

import React, { useEffect, useState } from "react";
import SearchFilter from "@/components/SearchFilter";
import Products from "@/components/Products";
import { getProducts } from "@/lib/actions/products.actions";
import { StoreProps } from "@/types/firebasetypes";

const Page = ({ searchParams }: StoreProps) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false); // Add loading state

  // Fetch products inside useEffect to handle async correctly
  useEffect(() => {
    const fetchFilteredProducts = async () => {
      setLoading(true); // Start loading
      try {
        const fetchedProducts = await getProducts({
          skinConcern: searchParams.skinConcern || "",
          limit: searchParams.limit || 10,
          skinType: searchParams.skinType || "",
          category: searchParams.category || "",
        });
        setProducts(fetchedProducts?.product || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchFilteredProducts(); // Call async function inside useEffect
  }, [searchParams]); // Re-run this effect when searchParams changes

  const formType = searchParams.formType || "create";

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Search Filter */}
      <SearchFilter searchParams={searchParams} />

      {/* Loading UI */}
      {loading ? (
        <div>Loading products...</div>
      ) : (
        <Products 
          isAdmin={false}
          products={products}
           />
      )}
    </div>
  );
};

export default Page;
