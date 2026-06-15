import StatCard from "@/components/global/StatCard";
import { useGetStore } from "@/hooks/use-query";
import type { StatCardProps } from "@/types/global";
import DashboardSkeleton from "../Skeletons/dashboardSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const StatCards = () => {
  const { data, isLoading, isError } = useGetStore();

  if (!data && !isLoading) {
    return null;
  }

  if (!data) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-2">
        {isLoading &&
          [1, 2, 3, 4].map(() => <Skeleton className="w-full h-40" />)}
      </div>
    );
  }
  const stats: StatCardProps[] = [
    {
      label: `Total Revenue`,
      title: "Total Revenue Today",
      description: "Revenue from completed orders",
      value: `PKR ${data && data?.totalRevenue}`,
      badge: {
        type: "neutral",
        value: `${data && data?.totalRevenue}`,
      },
    },
    {
      label: `Orders`,
      title: `Total Orders`,
      description: "Total orders completed",
      value: `${data && data?.totalOrders}`,
      badge: {
        type: "neutral",
        value: `${data && data?.totalOrders}`,
      },
    },
    {
      label: `Rating`,
      title: "Average Customer Rating",
      description: "Rating life time  ",
      value: `${data.avgRating.toFixed(1)}`,
      badge: {
        type: "neutral",
        value: `${data.avgRating.toFixed(1)}`,
      },
    },
    {
      label: `Rating`,
      title: "Average Customer Rating",
      description: "Change from last month",
      value: `${data.avgRating}`,
      badge: {
        type: "negative",
        value: `${data.avgRating}`,
      },
    },
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-2">
      {isLoading &&
        [1, 2, 3, 4].map(() => <Skeleton className="w-full h-40" />)}
      {!isLoading &&
        data &&
        stats.map((stat, index) => <StatCard key={index} {...stat} />)}
    </div>
  );
};

export default StatCards;
