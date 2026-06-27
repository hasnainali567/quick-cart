import useGetStoreCategories from "../hooks/useGetStoreCategories";
import CategoryCard from "./CategoryCard";
import { HugeiconsIcon } from "@hugeicons/react";
import { Check } from "@hugeicons/core-free-icons";

const StoreCategories = () => {
  const { data: categories } = useGetStoreCategories({});

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <HugeiconsIcon
          icon={Check}
          className="size-8  p-1 bg-primary/10  rounded-md"
        />
        <h2 className="text-lg font-medium ">
          Categories Store Currently Operating
        </h2>
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories && categories.length > 0 ? (
          categories.map(({ category, id }) => (
            <CategoryCard key={id} category={category} />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">
              No categories found
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreCategories;
