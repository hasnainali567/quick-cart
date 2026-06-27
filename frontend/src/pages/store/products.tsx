import { Button } from "@/components/ui/button";
import FitlerCard from "@/features/product/components/FitlerCard";
import ProductsTable from "@/features/product/components/ProductsTable";
import useGetStoreProducts from "@/features/product/hooks/useGetStoreProducts";
import { Plus } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useSearchParams } from "react-router-dom";

const Products = () => {
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page")) || 1;
  const take = Number(params.get("take")) || 10;
  const category = params.get("category") || "";

  const { data } = useGetStoreProducts({
    page,
    take,
    filters: [{ filter: "category", value: category }],
  });
  if (!data) {
    return null;
  }

  const handleCategoryChange = (category: string) => {
    setParams((prev) => {
      const updated = new URLSearchParams(prev);
      updated.set("category", category);
      return updated;
    });
  };
  const handleStatusChange = (status: string) => {
    console.log(status);
  };
  const handleStockChange = (stock: string) => {
    console.log(stock);
  };
  const handleSearch = (search: string) => {
    console.log(search);
  };

  return (
    <div className="p-4 flex-1 w-full flex flex-col gap-2 ">
      <div className="flex items-center justify-between pb-4 ">
        <div className="flex flex-col ">
          <h1 className="text-3xl font-semibold capitalize">Products</h1>
          <p className="text-muted-foreground">
            Manage your inventory, tracking and product statuses
          </p>
        </div>
        <Button asChild>
          <Link to={"/store/add-product"}>
            <HugeiconsIcon icon={Plus} />
            Add Product
          </Link>
        </Button>
      </div>
      <FitlerCard
        onCategoryChange={handleCategoryChange}
        onSearch={handleSearch}
        onStatusChange={handleStatusChange}
        onStockChange={handleStockChange}
      />
      <ProductsTable {...data} />
    </div>
  );
};

export default Products;
