import ProductForm from '@/components/forms/ProductsForm';
import { getProducts } from '@/lib/firebase';
import { StoreProps } from '@/types/firebasetypes';

import SearchFilter from '@/components/SearchFilter';
import Products from '@/components/Products';

const Page = async ({ searchParams }: StoreProps) => {
  // Fetch the products data based on the searchParams
  const fetchedProducts = await getProducts({
    skinConcern: searchParams.skinConcern || '',
    limit: searchParams.limit || 10,
    skinType: searchParams.skinType || '',
    category: searchParams.category || '',
  });

  // Check if products are valid
  const products = fetchedProducts?.product && Array.isArray(fetchedProducts.product)
    ? fetchedProducts.product
    : [];

  console.log(products);

  // Check if there's a selected product in the search params for editing
  const selectedProductId = searchParams.productId || null;
  const formType = searchParams.formType || 'create';

  // Extract all product IDs
  const productIds = products.map((prod) => prod.id);

  // Function to find a matching product by ID
  const getSelectedProduct = (productId: any) => {
    if (!productId) return null;

    // Check if the selected productId matches any fetched product IDs
    const matchedProduct = products.find((prod) => prod.id === productId);

    if (matchedProduct) {
      return matchedProduct;
    }
    return null; // Return null if no match is found
  };

  // Use the getSelectedProduct function to find the selected product
  const selectedProduct = getSelectedProduct(selectedProductId);

  console.log(selectedProduct, 'was selected', searchParams);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Product Form */}
      <div className="max-w-2xl mx-auto bg-white p-8 shadow-lg rounded-lg mb-8">
        <ProductForm 
          type={formType}
          products={selectedProduct}  // Pass the selected product when in "update" mode
          productId={selectedProduct?.id ?? ''} 
        />
      </div>

      <div>
        <SearchFilter
          searchParams={searchParams}
        />
      </div>

      {/* Pass the fetched products to the Products component */}
      <Products products={products} />
    </div>
  );
};

export default Page;
