import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const OrderSheetSkeleton = () => {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-4 space-y-4 pb-28 scrollbar-none">
        <div className="space-y-2">
          <Skeleton className="h-4 w-30" />
          <Skeleton className="h-30 w-full" />
          <Skeleton className="h-30 w-full" />
        </div>
        <Separator className="my-4" />
        <div className="flex flex-col gap-2 pt-2">
          <Skeleton className="h-4 w-30" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
        <Separator className="my-4" />
        <div className="space-y-2 pt-2">
          <Skeleton className="h-4 w-30" />

          <div className="w-full rounded-md overflow-hidden">
            <Skeleton className="h-30 w-full rounded-none" />
            <Separator />
            <Skeleton className="h-15 w-full rounded-none" />
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 border-t bg-background p-4 space-y-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
};

export default OrderSheetSkeleton;
