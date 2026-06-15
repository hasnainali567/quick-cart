import { useQuery } from "@tanstack/react-query";
import { getStoreProducts } from "../api/queries";

const useGetStoreProducts = () => {
  return useQuery({
    queryKey: ["store", "products"],
    queryFn: getStoreProducts,
  });
};

export default useGetStoreProducts;
