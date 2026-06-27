import CategoriesHeader from "@/features/category/components/CategoriesHeader";
import CategoryGrid from "@/features/category/components/CategoryGrid";
import StoreCategories from "@/features/category/components/StoreCategories";

const CategoriesPage = () => {
  return (
    <div className="space-y-6 p-4 overflow-y-auto scrollbar-none">
      <CategoriesHeader />
      <StoreCategories />
      <CategoryGrid />
    </div>
  );
};

export default CategoriesPage;
