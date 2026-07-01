import useGetStoreProduct from "./useGetStoreProduct";

export const useProductSheet = (slug: string, enabled: boolean) => {
  const { data: product, isLoading } = useGetStoreProduct({
    slug,
    enabled,
  });

  return {
    product,
    isLoading,
  };
};
