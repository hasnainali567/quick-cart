import Dialog from "@/components/global/Dialog";
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
import { LoaderCircle, Plus } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Icon } from "@iconify/react";
import type React from "react";
import { Link } from "react-router-dom";
import { useAddCategorytoStore } from "../hooks/useAddCategorytoStore";
import { toast } from "sonner";

type CategoryCardProps = {
  category: Category;
  onClick?: (id: string) => void;
};

const CategoryNotSelectedCard = ({ category, onClick }: CategoryCardProps) => {
  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-md transition-all"
      onClick={() => onClick?.(category.id)}
    >
      <CardContent className={cn("space-y-2")}>
        <div className="h-40 w-full rounded-md relative">
          {/* show a black and white filter on the image */}
          <img
            src={category.image}
            alt={category.name}
            className="h-full w-full object-cover rounded-md grayscale"
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
        <AddToStoreDialog
          id={category.id}
          trigger={
            <Button>
              <HugeiconsIcon icon={Plus} />
              Add to Store
            </Button>
          }
        />
      </CardFooter>
    </Card>
  );
};

export default CategoryNotSelectedCard;

const AddToStoreDialog = ({
  trigger,
  id,
}: {
  trigger: React.ReactNode;
  id: string;
}) => {
  const { mutate: addCategory, isPending } = useAddCategorytoStore({
    onSuccess: () => {
      toast.success("Category added to store");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  return (
    <Dialog
      title="Add to store"
      trigger={trigger}
      description="Choose a way to add this category to your store"
    >
      <div className="flex items-center justify-end gap-2">
        <Button variant={"outline"}>Cancel</Button>
        <Button onClick={() => addCategory({ id })} disabled={isPending}>
          <HugeiconsIcon
            icon={isPending ? LoaderCircle : Plus}
            className={cn(isPending ? "animate-spin" : "")}
          />
          {isPending ? "Adding..." : "Add To Store"}
        </Button>
      </div>
    </Dialog>
  );
};
