import { HugeiconsIcon } from "@hugeicons/react";
import { Check } from "@hugeicons/core-free-icons";
import useGetCategories from "../hooks/useGetCategories";
import { useRef, useCallback } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import CategoryNotSelectedCard from "./CategoryNotSelectedCard";

const CategoryGrid = () => {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage, isPending } =
    useGetCategories({});

  const categories = data?.pages.flatMap((page) => page.docs);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <HugeiconsIcon
          icon={Check}
          className="size-8  p-1 bg-primary/10  rounded-md"
        />
        <h2 className="text-lg font-medium ">Available Categories</h2>
      </div>
      <div className="w-full grid grid-cols-1 @max-xs::grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories?.map((category) => (
          <CategoryNotSelectedCard key={category.id} category={category} />
        ))}
      </div>

      {/* Infinite Scroll Marker */}
      <div
        ref={loadMoreRef}
        className="w-full grid grid-cols-1 @max-xs::grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        {isFetchingNextPage &&
          Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-56" />
          ))}
      </div>

      {isPending && (
        <div className="w-full grid grid-cols-1 @max-xs::grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-56" />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryGrid;
