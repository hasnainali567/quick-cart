import { Button } from "@/components/ui/button";
import FitlerCard from "@/features/product/components/FitlerCard";
import ProductsTable from "@/features/product/components/ProductsTable";
import useGetStoreProducts from "@/features/product/hooks/useGetStoreProducts";
import { Plus } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

const Products = () => {
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page")) || 1;
  const take = Number(params.get("take")) || 10;
  const category = params.get("category") || "";
  const status = params.get("status") || "";
  const stock = params.get("stock") || "";

  const [searchInput, setSearchInput] = useState(params.get("search") || "");
  const debounceRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);

  const updateParam = (key: string, value: string) => {
    setParams((prev) => {
      const updated = new URLSearchParams(prev);
      if (!value || value === "all") {
        updated.delete(key);
      } else {
        updated.set(key, value);
      }
      updated.set("page", "1");
      return updated;
    });
  };

  const filters: { filter: string; value: string }[] = [];

  if (category && category !== "all") {
    filters.push({ filter: "category", value: category });
  }
  if (status && status !== "all") {
    filters.push({ filter: "status", value: status });
  }
  if (stock && stock !== "all") {
    if (stock === "in") {
      filters.push({ filter: "inStock", value: "true" });
    } else if (stock === "out") {
      filters.push({ filter: "outOfStock", value: "true" });
    }
  }

  const searchVal = params.get("search") || "";
  if (searchVal) {
    filters.push({ filter: "search", value: searchVal });
  }

  const { data } = useGetStoreProducts({
    page,
    take,
    filters,
  });

  if (!data) {
    return null;
  }

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateParam("search", value);
    }, 400);
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
        searchValue={searchInput}
        onSearchChange={handleSearchChange}
        category={category}
        onCategoryChange={(val) => updateParam("category", val)}
        status={status}
        onStatusChange={(val) => updateParam("status", val)}
        stock={stock}
        onStockChange={(val) => updateParam("stock", val)}
      />
      <ProductsTable {...data} />
    </div>
  );
};

export default Products;
