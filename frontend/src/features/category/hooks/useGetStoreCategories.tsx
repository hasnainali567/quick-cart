import { useQuery } from "@tanstack/react-query";
import { getStoreCategories } from "../api/queries";

const useGetStoreCategories = ({ enabled = true }: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ["store", "categories"],
    queryFn: getStoreCategories,
    enabled,
    staleTime: 1000 * 60 * 60,
  });
};

export default useGetStoreCategories;
