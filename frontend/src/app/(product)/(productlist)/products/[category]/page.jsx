import React from 'react'

const ProductWithCategory = async ({ params }) => {
  const { category } = await params;

  console.log(category);
  
  return (
    <div>ProductWithCategory</div>
  )
}

export default ProductWithCategory