import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSession } from "@/lib/auth";
import { ListChecks } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useQuery } from "@tanstack/react-query";
import { Link, Navigate } from "react-router-dom";
import Stats from "./_compoents/Stats";
import Table from "@/components/global/ProductsTable";
import { TableCell, TableRow } from "@/components/ui/table";

const HEADS = [
  'product',
  'category',
  'price',
  "status",
  "action"
]

const Dashboard = () => {
  const {
    data: store,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/store`, {
        credentials: "include",
      });
      return await res.json();
    },
    staleTime: 1000 * 3,
  });

  console.log(isError, isLoading, store);

  const { data, isPending } = useSession();
  const user = data?.user;

  if (!user && isPending) {
    return <div>Loading...</div>;
  }

  if ((user as { role?: string }).role !== "STORE_ADMIN") {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <div>
        <h3 className="text-xl font-medium">Welcome to the Dashboard</h3>
        <p className="text-sm font-light text-muted-foreground">
          Here is whats happennig at the mall today.
        </p>
      </div>

      <Stats store={store?.data} />
      <div className="flex w-full">
        <Card className="w-full">
          <CardHeader className="flex items-center justify-between">
            <div className=" flex gap-2 items-center">
              <HugeiconsIcon icon={ListChecks} size={20} />
              <h4 className="text-base ">Featured Products</h4>
            </div>
            <Link to={'/dashboard/products'} className="underline ">View All</Link>
          </CardHeader>
          <CardContent>
            <Table  heads={HEADS} items={store?.data?.products} renderItem={(item, index) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
              </TableRow>
            )}/>
          </CardContent>
        </Card>
        <div></div>
      </div>
    </div>
  );
};

export default Dashboard;
