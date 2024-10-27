'use client';

import { deleteProduct, updateProducts } from '@/lib/actions/products.actions';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Trash2, Plus, ShoppingBag } from 'lucide-react';
import { useState } from 'react';

const ProductsList = ({ products, isAdmin }: { products: any[], isAdmin: boolean }) => {
  const router = useRouter();
  const [localProducts, setLocalProducts] = useState(products);

  const handleDelete = async (productId: string, productName: string) => {
    try {
      await deleteProduct(productId, productName, setLocalProducts);
    } catch (error) {
      console.error("Failed to delete product: ", error);
    }
  };

  const handleEdit = async (product: any) => {
    try {
      const updatedProduct = { number: product.number + 1 };
      await updateProducts(product.id, { product: updatedProduct });

      setLocalProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === product.id ? { ...p, number: updatedProduct.number } : p
        )
      );
    } catch (error) {
      console.error('Error updating product number: ', error);
    }
  };

  const handleProductClick = (productId: string) => {
    router.push(`shop/products/${productId}`);
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
          className="bg-white border border-gray-200 rounded-lg shadow-lg 
          overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          onClick={() => handleProductClick(product.id)}
        >
          {product.images?.length > 0 && (
            <div className="w-full h-56 relative flex justify-center items-center ">
              <Image
                src={product.images[0] || '/placeholder.png'}
                alt={product.name}
                className="object-contain"
                width={200}
                height={200}
              />
            </div>
          )}

          <div className="p-5">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">{product.name || 'No Name'}</h2>
              <p className="text-sm text-gray-500">({product.number || 0})</p>
            </div>
            <p className="text-sm text-gray-600 my-3">{product.description || 'No Description'}</p>
            <p className="text-lg font-semibold text-green-600">{product.price ? `$${product.price}` : 'N/A'}</p>
          </div>

          <div className="flex justify-between items-center space-x-4 p-5 border-t border-gray-200 bg-gray-50">
            {isAdmin ? (
              <>
                <Trash2
                  className="cursor-pointer text-red-600 hover:text-red-700 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(product.id!, product.name ?? '');
                  }}
                  size={24}
                />
                <Plus
                  className="cursor-pointer text-blue-600 hover:text-blue-700 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(product);
                  }}
                  size={24}
                />
              </>
            ) : (
              <button 
                className="bg-gold-400 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                onClick={(e) => e.stopPropagation()}
              >
                <ShoppingBag size={18} />
                <span>Add to Bag</span>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductsList;
