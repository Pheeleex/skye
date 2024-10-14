'use client';

import { deleteProduct, updateProducts } from '@/lib/actions/products.actions';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Trash2, Plus, ShoppingBag } from 'lucide-react'; // Importing Lucide icons
import { useState } from 'react';

const ProductsList = ({ products }: { products: any[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [localProducts, setLocalProducts] = useState(products);

  const handleEdit = async (product: any) => {
    try {
      const updatedProduct = { number: product.number + 1 }; // Increment the number
      
      await updateProducts(product.id, { product: updatedProduct });
      
      setLocalProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === product.id ? { ...p, number: updatedProduct.number } : p
        )
      );
  
      console.log('Product number incremented successfully');
    } catch (error) {
      console.error('Error updating product number: ', error);
    }
  };

  const isDataEmpty = !Array.isArray(localProducts) || localProducts.length < 1;

  if (isDataEmpty) {
    return (
      <div className="text-center mt-8">
        <p className="text-lg text-gray-600">No products found</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {localProducts.map((product) => (
        <div 
          key={product.id} 
          className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
        >
          {/* Centered image section */}
          {product.images?.length > 0 && (
            <div className="w-full h-56 relative flex justify-center items-center bg-gray-50">
              <Image
                src={product.images[0] || '/placeholder.png'}
                alt={product.name}
                className="object-contain"
                width={200}
                height={200}
              />
            </div>
          )}
          
          {/* Product Info */}
          <div className="p-5">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">{product.name || 'No Name'}</h2>
              <p className="text-sm text-gray-500">({product.number || 0})</p>
            </div>
            <p className="text-sm text-gray-600 my-3">{product.description || 'No Description'}</p>
            <p className="text-lg font-semibold text-green-600">{product.price ? `$${product.price}` : 'N/A'}</p>
          </div>

          {/* Actions Section */}
          <div className="flex justify-between items-center space-x-4 p-5 border-t border-gray-200 bg-gray-50">
            <Trash2
              className="cursor-pointer text-red-600 hover:text-red-700 transition-colors"
              onClick={() => deleteProduct(product.id!, product.name ?? '', () => console.log('Product Deleted'))}
              size={24}
            />
            <Plus
              className="cursor-pointer text-blue-600 hover:text-blue-700 transition-colors"
              onClick={() => handleEdit(product)}
              size={24}
            />
            <button 
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <ShoppingBag size={18} />
              <span>Add to Bag</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsList;
