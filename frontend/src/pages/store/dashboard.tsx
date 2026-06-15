import TopProgressBar from "@/components/global/AuthLoader";
import IncomingOrders from "@/components/store/dashboard/IncomingOrders";
import RecentOrders from "@/components/store/dashboard/RecentOrders";
import StatCards from "@/components/store/dashboard/StatCards";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useGetStore } from "@/hooks/use-query";
import { ShoppingBagFavoriteFreeIcons } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { toast } from "sonner";

const Dashboard = () => {
  const { data, isError, isLoading } = useGetStore();

  if (isLoading) {
    return <TopProgressBar isPending={isLoading} />;
  }

  if (isError) {
    toast.error("Failed to fetch store");
    return null;
  }

  return (
    <div
      className="flex-1 min-h-full w-full flex gap-2  p-2 md:p-4
    "
    >
      {/* should not scroll */}
      <div className="flex-1 overflow-hidden flex flex-col gap-2 md:gap-4  scrollbar-none h-[94%] relative">
        <Card className="w-full flex md:p-2 pb-2 shrink-0 sticky top-0 gap-0 py-2 md:py-auto">
          <CardContent className="grid grid-cols-1 md:grid-cols-2 items-center justify-between w-full px-0  pb-2">
            <div className="flex items-center gap-2 h-full">
              <HugeiconsIcon
                icon={ShoppingBagFavoriteFreeIcons}
                className="p-1 rounded-md size-10 bg-accent"
              />
              <div className="-space-y-1">
                <h3 className="text-base font-medium text-primary">
                  {data?.name || ""}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {data?.status === "OPEN"
                    ? "Actively accenting orders"
                    : "Not accepting orders"}
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center justify-between md:justify-end gap-2 pt-2 md:py-0">
              <p className="uppercase text-sm font-medium">
                Store Status:{" "}
                <span
                  className={`${data?.status === "OPEN" ? "text-green-500" : "text-red-500"}`}
                >
                  {data?.status === "OPEN" ? "OPEN" : "CLOSED"}
                </span>
              </p>
              <Switch
                checked={data?.status === "OPEN"}
                onCheckedChange={() => {
                  // TODO: implement store status change
                }}
              />
              <Button>Manage Schedule</Button>
            </div>
          </CardContent>
          <CardFooter className="md:hidden p-2">
            <div className="w-full flex items-center justify-between gap-2 ">
              <p className="uppercase text-sm font-medium">
                Store Status:{" "}
                <span
                  className={`${data?.status === "OPEN" ? "text-green-500" : "text-red-500"}`}
                >
                  {data?.status === "OPEN" ? "OPEN" : "CLOSED"}
                </span>
              </p>
              <Switch
                checked={data?.status === "OPEN"}
                onCheckedChange={() => {
                  // TODO: implement store status change
                }}
              />
            </div>
          </CardFooter>
        </Card>
        {/* should scroll */}
        <div className="flex-1 h-full overflow-y-auto scrollbar-none space-y-4">
          <StatCards />
          <RecentOrders />
        </div>
      </div>
      <IncomingOrders />
    </div>
  );
};

export default Dashboard;
