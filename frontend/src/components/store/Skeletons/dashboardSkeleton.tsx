import { Skeleton } from "@/components/ui/skeleton";

const DashboardSkeleton = () => {
  return (
    <div className="h-full w-full flex flex-col gap-2  scrollbar-none">
      <div className="w-full h-20">
        <Skeleton className="h-full w-full p-4 flex items-center justify-between">
          <Skeleton className="h-full w-80 bg-red-200" />
          <Skeleton className="h-full w-40 bg-red-200" />
        </Skeleton>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
        <Skeleton className="w-full h-40">
          <Skeleton className="h-full  bg-red-200" />
        </Skeleton>
        <Skeleton className="w-full h-40" />
        <Skeleton className="w-full h-40" />
        <Skeleton className="w-full h-40" />
      </div>
      <div className="w-full h-120 flex items-center gap-2">
        <Skeleton className="flex-1 h-full"></Skeleton>
        <Skeleton className="w-1/4 h-full" />
      </div>
      <div className="w-full h-100">
        <Skeleton className="w-full h-full" />
      </div>
    </div>
  );
};

export default DashboardSkeleton;
