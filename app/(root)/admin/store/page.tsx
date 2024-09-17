
import ProductForm from '@/components/forms/ProductsForm'
import { getProducts } from '@/lib/actions/appointments.actions'
import Image from 'next/image'
import React from 'react'

const page = async() => {
  const products = await getProducts()
  console.log(products)
  console.log( `There are ${products.length} products` )
 // console.log(products)
  return (
    <div>
        <ProductForm  />    

        <div>
        {products?.length ? (
          products.map((product, i) => (
            <div key={i}>
              <h1>{product.name}, ${product.price}</h1>

              {/* Display the product image */}
              {product.imageUrl ? (
                <Image
                  priority
                  src={product.imageUrl}
                  alt={`Product Image ${i}`}
                  width={500}
                  height={500}
                  objectFit="contain" // Ensure proper image scaling
                />
              ) : (
                <p>No image available</p>
              )}
            </div>
          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
    </div>
  )
}

export default page