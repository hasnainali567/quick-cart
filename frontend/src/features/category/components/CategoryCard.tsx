import Dropdown from "@/components/global/dropdown";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/store.types";
import { Dots, Edit, Trash2 } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Icon } from "@iconify/react";
import type React from "react";
import { Link } from "react-router-dom";

type CategoryCardProps = {
  category: Category;
  onClick?: (id: string) => void;
};

const CategoryCard = ({ category, onClick }: CategoryCardProps) => {
  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-md transition-all"
      onClick={() => onClick?.(category.id)}
    >
      <CardContent className={cn("space-y-2")}>
        <div className="h-40 w-full rounded-md relative">
          <img
            src={category.image}
            alt={category.name}
            className="h-full w-full object-cover rounded-md"
          />
          <Icon
            icon={category.icon}
            className="absolute top-2 left-2 size-12 text-primary  bg-primary/30 p-1 rounded-md backdrop-blur-xl"
          />
        </div>
        <div className="space-y-0.5 overflow-hidden pt-1">
          <CardTitle className="text-lg truncate">{category.name}</CardTitle>
          <CardDescription className="line-clamp-2 truncate">
            {category.description}
          </CardDescription>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon
            icon={"gridicons:product"}
            className="p-1.5 rounded-md text-primary bg-primary/10 size-8"
          />
          <div>
            <Link to={`/store/products?category=${category.slug}`}>
              <p className=" text-muted-foreground font-medium">
                {category._count?.products} products
              </p>
            </Link>
          </div>
        </div>
        <CategoryCardDropdown
          trigger={
            <Button variant={"ghost"}>
              <HugeiconsIcon icon={Dots} className="rotate-90" />
            </Button>
          }
        />
      </CardFooter>
    </Card>
  );
};

export default CategoryCard;

const CategoryCardDropdown = ({ trigger }: { trigger: React.ReactNode }) => {
  return (
    <Dropdown
      trigger={trigger}
      align="start"
      className="w-fit"
      items={[
        { variant: "destructive", icon: Trash2, label: "Delete" },
        { variant: "outline", icon: Edit, label: "Edit" },
      ]}
    ></Dropdown>
  );
};
