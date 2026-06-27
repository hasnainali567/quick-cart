import React, { useState } from "react";
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
import { useSearchParams } from "react-router-dom";

type Props = {
  onSearch: (search: string) => void;
  onStatusChange: (status: string) => void;
  onCategoryChange: (category: string) => void;
  onStockChange: (stock: string) => void;
};

const FitlerCard = (props: Props) => {
  const { onSearch, onStatusChange, onCategoryChange, onStockChange } = props;
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [params] = useSearchParams();
  const category = params.get("category") || "";
  const { data } = useGetStoreCategories({ enabled: categoryOpen });
  console.log(category);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const handleStatusChange = (status: string) => {
    onStatusChange(status);
  };

  const handleCategoryChange = (category: string) => {
    onCategoryChange(category);
  };

  const handleStockChange = (stock: string) => {
    onStockChange(stock);
  };

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
              onChange={handleSearchChange}
            />
          </InputGroup>
        </Field>
        <div className="flex items-center gap-2 ">
          <Label className="text-nowrap">Filter by : </Label>
          <Select onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Status: All" />
            </SelectTrigger>
            <SelectContent position="popper" align="end">
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
          <Select
            onOpenChange={setCategoryOpen}
            onValueChange={handleCategoryChange}
            value={
              data?.find(({ category: { slug } }) => slug === category)
                ?.category.name || undefined
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Category: All" />
            </SelectTrigger>
            <SelectContent position="popper" align="end">
              <SelectItem value="all">All</SelectItem>
              {data &&
                data.map(({ category, id }) => (
                  <SelectItem key={id} value={category.slug}>
                    <Icon icon={category.icon} />
                    {category.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Select onValueChange={handleStockChange}>
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
  );
};

export default FitlerCard;
