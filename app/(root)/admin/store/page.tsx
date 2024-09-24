'use client'
import React, { useEffect, useState } from 'react';
import ProductForm from '@/components/forms/ProductsForm';
import { deleteProduct, getProducts } from '@/lib/firebase';
import { StoreProps } from '@/types/firebasetypes';
import Image from 'next/image';
import SearchFilter from '@/components/SearchFilter';

const Page = ({ searchParams }: StoreProps) => {
  const [products, setProducts] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [type, setType] = useState<'create' | 'update'>('create');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const fetchedProducts = await getProducts({
          skinConcern: searchParams.skinConcern || '',
          limit: searchParams.limit || 10,
          skinType: searchParams.skinType || '',
          category: searchParams.category || '',
        });

        if (fetchedProducts?.product && Array.isArray(fetchedProducts.product)) {
          setProducts(fetchedProducts.product);
        } else {
          console.log('Products data is not valid or empty');
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const isDataEmpty = !Array.isArray(products) || products.length < 1;

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setType('update');
    console.log(product.id, type, 'productId and Type');
  };
  console.log(selectedProduct)

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Product Form */}
      <div className="max-w-2xl mx-auto bg-white p-8 shadow-lg rounded-lg mb-8">
        <ProductForm
          type={type}
          products={selectedProduct} // Correct prop name
          productId={selectedProduct?.id}
        />
      </div>

    <div>
      <SearchFilter />
    </div>

      {/* Loading state */}
      {loading ? (
        <div className="text-center mt-8">
          <p className="text-lg text-gray-600">Loading products...</p>
        </div>
      ) : isDataEmpty ? (
        <div className="text-center mt-8">
          <p className="text-lg text-gray-600">No products found</p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
              {product.images?.length > 0 && (
                <div className="w-full h-56 relative">
                  <Image
                    src={product.images[0] || '/placeholder.png'}  // Ensure placeholder exists
                    alt={product.name}
                    className="rounded-t-lg"
                    style={{ objectFit: 'cover' }}
                    width={200}
                    height={200}
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="text-lg font-bold text-gray-800 mb-2">{product.name || 'No Name'}</h2>
                <p className="text-sm text-gray-600 mb-4">{product.description || 'No Description'}</p>
                <p className="text-lg font-semibold text-green-600">{product.price || 'N/A'}</p>
              </div>
              {/* Icons Section (placed below the product details) */}
              <div className="flex justify-between space-x-4 p-4">
                <Image
                  src="/assets/icons/delete.svg"
                  alt="Delete"
                  className="cursor-pointer"
                  style={{ objectFit: 'cover' }}
                  width={50}
                  height={50}
                  onClick={() => deleteProduct(product.id!, product.name ?? '', setProducts)}
                />
                <Image
                  src="/assets/icons/edit.svg"
                  alt="Edit"
                  className="cursor-pointer"
                  style={{ objectFit: 'cover' }}
                  width={50}
                  height={50}
                  onClick={() => handleEdit(product)} // Pass the correct product
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
