import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Money, ShoppingBag } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";

const Stats = ({ store }: { store: any }) => {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-4">
      <Card className="flex flex-col p-2">
        <div className="flex items-center justify-between">
          <div className="size-12 p-1">
            <HugeiconsIcon icon={Money} className="size-full" />
          </div>
          <Badge variant={"outline"} >
            TODAY
          </Badge>
        </div>
        <div>
          <span className="text-sm text-muted-foreground">Total Revanue</span>
          <h2 className="text-xl font-medium">PKR {store?.totalRevenue?.toFixed(2)}</h2>
        </div>
      </Card>
      <Card className="flex flex-col p-2">
        <div className="flex items-center justify-between">
          <div className="size-12 p-1">
            <HugeiconsIcon icon={ShoppingBag} className="size-full" />
          </div>
          <Badge variant={"outline"} >
            TODAY
          </Badge>
        </div>
        <div>
          <span className="text-sm text-muted-foreground">Total Orders</span>
          <h2 className="text-xl font-medium">{store?.totalOrders}</h2>
        </div>
      </Card>
      <Card className="flex flex-col p-2">
        <div className="flex items-center justify-between">
          <div className="size-12 p-1">
            <HugeiconsIcon icon={Money} className="size-full" />
          </div>
          <Badge variant={"outline"} >
            LIFE TIME
          </Badge>
        </div>
        <div>
          <span className="text-sm text-muted-foreground">Average Rating</span>
          <h2 className="text-xl font-medium">{store?.avgRating?.toFixed(1)}</h2>
        </div>
      </Card>
      <Card className="flex flex-col p-2">
        <div className="flex items-center justify-between">
          <div className="size-12 p-1">
            <HugeiconsIcon icon={Money} className="size-full" />
          </div>
          <Badge variant={"outline"} >
            REVIEWS
          </Badge>
        </div>
        <div>
          <span className="text-sm text-muted-foreground">Total Reviews</span>
          <h2 className="text-xl font-medium">{store?.totalReviews}</h2>
        </div>
      </Card>
    </div>
  );
};

export default Stats;
