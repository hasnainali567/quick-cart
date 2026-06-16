import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProductsTable from "@/features/product/components/ProductsTable";
import useGetStoreProducts from "@/features/product/hooks/useGetStoreProducts";
import { cn } from "@/lib/utils";
import { Plus, Search } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useSearchParams } from "react-router-dom";

const Products = () => {
  const [params] = useSearchParams();
  const page = Number(params.get("page")) || 1;
  const take = Number(params.get("take")) || 1;

  console.log(page, take);

  const { data } = useGetStoreProducts({ page, take });
  if (!data) {
    return null;
  }

  return (
    <div className="p-4 flex-1 w-full flex flex-col gap-2 ">
      <div className="flex items-center justify-between pb-4 ">
        <div className="flex flex-col ">
          <h1 className="text-3xl font-semibold capitalize">Products</h1>
          <p className="text-muted-foreground">
            Manage your inventory, tracking and product statuses
          </p>
        </div>
        <Button>
          <HugeiconsIcon icon={Plus} />
          Add Product
        </Button>
      </div>
      <Card>
        <CardContent className={cn("flex items-center justify-between gap-2")}>
          <Field>
            <FieldLabel>Search</FieldLabel>
            <InputGroup className="max-w-100">
              <InputGroupAddon>
                <HugeiconsIcon icon={Search} />
              </InputGroupAddon>
              <InputGroupInput placeholder="Search products" />
            </InputGroup>
          </Field>
          <div className="flex items-center gap-2 ">
            <Label className="text-nowrap">Filter by : </Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Status: All" />
              </SelectTrigger>
              <SelectContent position="popper" align="end">
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Category: All" />
              </SelectTrigger>
              <SelectContent position="popper" align="end">
                <SelectItem value="vagetabels">Vegetables</SelectItem>
                <SelectItem value="fruits">Fruits</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Stock: All" />
              </SelectTrigger>
              <SelectContent position="popper" align="end">
                <SelectItem value="out">Out of Stock</SelectItem>
                <SelectItem value="in">In Stock</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      <ProductsTable {...data} />
    </div>
  );
};

export default Products;
