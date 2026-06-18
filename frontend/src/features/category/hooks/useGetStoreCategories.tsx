import { useQuery } from "@tanstack/react-query";
import { getStoreCategories } from "../api/queries";

const useGetStoreCategories = () => {
  return useQuery({
    queryKey: ["store", "categories"],
    queryFn: getStoreCategories,
    staleTime: 1000 * 60 * 60
  });
};

export default useGetStoreCategories;
