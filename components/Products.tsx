'use client'
import { deleteProduct } from '@/lib/firebase';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation'; // Also import useSearchParams

const Products = ({ products }: { products: any[] }) => {
  const router = useRouter(); // Get the router instance
  const searchParams = useSearchParams(); // Get the current search parameters

  const handleEdit = (product: any) => {
    console.log('Edit Product:', product.id);

    // Get the current search params and append the new ones
    const params = new URLSearchParams(searchParams.toString());
    params.set('productId', product.id); // Set productId
    params.set('formType', 'update');    // Set formType to update

    // Push the updated query params to the router
    router.push(`?${params.toString()}`);
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
            <h2 className="text-lg font-bold text-gray-800 mb-2">{product.name || 'No Name'}</h2>
            <p className="text-sm text-gray-600 mb-4">{product.description || 'No Description'}</p>
            <p className="text-lg font-semibold text-green-600">{product.price || 'N/A'}</p>
          </div>
          {/* Icons Section */}
          <div className="flex justify-between space-x-4 p-4">
            <Image
              src="/assets/icons/delete.svg"
              alt="Delete"
              className="cursor-pointer"
              style={{ objectFit: 'cover' }}
              width={50}
              height={50}
              onClick={() => deleteProduct(product.id!, product.name ?? '', () => console.log('Product Deleted'))}
            />
            <Image
              src="/assets/icons/edit.svg"
              alt="Edit"
              className="cursor-pointer"
              style={{ objectFit: 'cover' }}
              width={50}
              height={50}
              onClick={() => handleEdit(product)} // Trigger the edit function
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Products;
