import { useQuery } from "@tanstack/react-query";
import { getAdminCategories } from "../api/categories";
import type { GetCategoriesParams } from "../api/categories";

const useGetAdminCategories = (params: GetCategoriesParams) => {
  return useQuery({
    queryKey: ["admin", "categories", params],
    queryFn: () => getAdminCategories(params),
    placeholderData: (prev) => prev,
  });
};

export default useGetAdminCategories;
