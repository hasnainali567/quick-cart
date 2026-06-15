import useGetStoreProducts from "@/features/product/hooks/useGetStoreProducts";

const Products = () => {
  const { data } = useGetStoreProducts();
  console.log(data);

  return <div></div>;
};

export default Products;
