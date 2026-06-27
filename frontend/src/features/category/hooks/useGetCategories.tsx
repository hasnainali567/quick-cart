import { useInfiniteQuery } from "@tanstack/react-query";
import { getCategories } from "../api/queries";

const useGetCategories = ({ enabled = true }: { enabled?: boolean }) => {
  return useInfiniteQuery({
    queryKey: ["categories", "all"],
    queryFn: ({ pageParam = 1 }) =>
      getCategories({ page: pageParam as number, limit: 10 }),
    enabled,
    staleTime: 1000 * 60 * 60,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.hasNextPage) {
        return lastPage.nextPage;
      }
      return undefined;
    },
  });
};

export default useGetCategories;
