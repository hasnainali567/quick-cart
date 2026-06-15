import useGetStoreProducts from "@/features/product/hooks/useGetStoreProducts";

const Products = () => {
  const { data, isError, isLoading } = useGetStoreProducts();

  if (!data) {
    return null;
  }
  console.log(data);

  return <div></div>;
};

export default Products;
