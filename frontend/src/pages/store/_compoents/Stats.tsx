import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Box, Money, ShoppingBag, Star, Stars } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import InfoCard from "./InfoCard";

const Stats = ({ store, isLoading }: { store: any; isLoading: boolean }) => {
  return isLoading ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-4">
      <Skeleton className="w-full h-30" />
      <Skeleton className="w-full h-30" />
      <Skeleton className="w-full h-30" />
      <Skeleton className="w-full h-30" />
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  gap-4">
      <InfoCard
        label={"total revenue"}
        icon={Money}
        title={`PKR ${store.totalRevenue}`}
        badge="Today"
      />
      <InfoCard
        label={"Total orders"}
        icon={Box}
        badge="today"
        title={`${store.totalOrders}`}
      />
      <InfoCard
        label={"average rating"}
        icon={Star}
        badge="lifetime"
        title={store.avgRating}
      />
      <InfoCard label={"Total reviews"} icon={Stars} badge="lifetime" title={store.totalReviews} />
    </div>
  );
};

export default Stats;
