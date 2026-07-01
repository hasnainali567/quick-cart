import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search } from "@hugeicons/core-free-icons";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import useGetStoreCategories from "@/features/category/hooks/useGetStoreCategories";
import { Icon } from "@iconify/react";

type Props = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  stock: string;
  onStockChange: (value: string) => void;
};

const FitlerCard = ({
  searchValue,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
  stock,
  onStockChange,
}: Props) => {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const { data } = useGetStoreCategories({
    enabled: categoryOpen || category !== "all",
  });

  return (
    <Card>
      <CardContent className={cn("flex items-center justify-between gap-2")}>
        <Field>
          <FieldLabel>Search</FieldLabel>
          <InputGroup className="max-w-100">
            <InputGroupAddon>
              <HugeiconsIcon icon={Search} />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search products"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </InputGroup>
        </Field>
        <div className="flex items-center gap-2 ">
          <Label className="text-nowrap">Filter by : </Label>
          <Select value={status || undefined} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Status: All" />
            </SelectTrigger>
            <SelectContent position="popper" align="end">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Select
            open={categoryOpen}
            onOpenChange={setCategoryOpen}
            value={category || undefined}
            onValueChange={onCategoryChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Category: All" />
            </SelectTrigger>
            <SelectContent position="popper" align="end">
              <SelectItem value="all">All</SelectItem>
              {data &&
                data.map(({ category: cat, id }) => (
                  <SelectItem key={id} value={cat.slug}>
                    <Icon icon={cat.icon} />
                    {cat.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Select value={stock || undefined} onValueChange={onStockChange}>
            <SelectTrigger>
              <SelectValue placeholder="Stock: All" />
            </SelectTrigger>
            <SelectContent position="popper" align="end">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="in">In Stock</SelectItem>
              <SelectItem value="out">Out of Stock</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default FitlerCard;
