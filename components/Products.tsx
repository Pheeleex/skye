'use client';

import { deleteProduct, updateProducts } from '@/lib/actions/products.actions';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Trash2, Plus } from 'lucide-react'; // Importing Lucide icons

const Products = ({ products }: { products: any[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleEdit = async (product: any) => {
    try {
      const updatedProduct = { number: product.number + 1 }; // Increment the number
  
      // Call the updateProducts function with the updated product
      await updateProducts(product.id, { product: updatedProduct });
  
      console.log('Product number incremented successfully');
    } catch (error) {
      console.error('Error updating product number: ', error);
    }
  };

  const isDataEmpty = !Array.isArray(products) || products.length < 1;

  if (isDataEmpty) {
    return (
      <div className="text-center mt-8">
        <p className="text-lg text-gray-600">No products found</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden">
          {product.images?.length > 0 && (
            <div className="w-full h-56 relative">
              <Image
                src={product.images[0] || '/placeholder.png'}
                alt={product.name}
                className="rounded-t-lg"
                style={{ objectFit: 'cover' }}
                width={200}
                height={200}
              />
            </div>
          )}
          <div className="p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-2">{product.name || 'No Name'} {product.number || ''}</h2>
            <p className="text-sm text-gray-600 mb-4">{product.description || 'No Description'}</p>
            <p className="text-lg font-semibold text-green-600">{product.price || 'N/A'}</p>
          </div>
          {/* Icons Section */}
          <div className="flex justify-between items-center space-x-4 p-4">
            <Trash2
              className="cursor-pointer text-red-600 hover:text-red-700"
              onClick={() => deleteProduct(product.id!, product.name ?? '', () => console.log('Product Deleted'))}
              size={24} // Set the size of the icon
            />
            <Plus
              className="cursor-pointer text-blue-600 hover:text-blue-700"
              onClick={() => handleEdit(product)} // Pass the current product
              size={24} // Set the size of the icon
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Products;
