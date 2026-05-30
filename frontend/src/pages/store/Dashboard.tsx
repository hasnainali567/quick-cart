import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useSession } from "@/lib/auth";
import { Dots, ListChecks } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, Navigate } from "react-router-dom";
import Stats from "./_compoents/Stats";
import Table from "@/components/global/ProductsTable";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import api from "@/lib/axios";
import { Switch } from "@/components/ui/switch";

const HEADS = ["product", "category", "price", "status", "action"];

const Dashboard = () => {
  const queryClient = useQueryClient()
  const {
    data: res,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["store", "dashboard"],
    queryFn: async () => {
      const res = await api.get('/store');
      return res.data
    },
    staleTime: 1000 * 3,
  });

  const { mutate: toggleStatus, isPending } = useMutation({
    mutationKey: ["store", "status"],
    mutationFn: async (storeId: string) => {
      const res = await api.patch(`/store/${storeId}/status`);
      return res.data;
    },
    onSuccess : () => {
      queryClient.invalidateQueries({queryKey : ['store']})
    }
  });

  const store = !isLoading && res.data;

  const { data, isPending: sessionPending } = useSession();
  const user = data?.user;

  if (!user && sessionPending) {
    return <div>Loading...</div>;
  }

  if ((user as { role?: string }).role !== "STORE_ADMIN") {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-5">
        <div className="">
          <h3 className="text-3xl font-medium">Welcome to the Dashboard</h3>
          <p className="font-light text-muted-foreground">
            Here is whats happennig at the mall today.
          </p>
        </div>
        <div className="flex flex-col gap-2 ">
          Store Status : {store.status}
          <Switch defaultChecked={!isLoading && store.status === 'OPEN'} disabled={isPending || isLoading} onClick={() => toggleStatus(store.id)} />
        </div>
      </div>

      <Stats store={store} isLoading={isLoading} />
      <div className="flex w-full gap-4">
        <Card className=" flex-1">
          <CardHeader className="flex items-center justify-between">
            <div className=" flex gap-2 items-center">
              <HugeiconsIcon icon={ListChecks} size={20} />
              <h4 className="text-base ">Featured Products</h4>
            </div>
            <Link to={"/dashboard/products"} className="underline ">
              View All
            </Link>
          </CardHeader>
          <CardContent>
            <Table
              heads={HEADS}
              items={!isLoading ? store?.products : [1, 2, 3, 4]}
              renderItem={(item, index) =>
                isLoading ? (
                  <TableRow>
                    {[1, 2, 3, 4, 5].map(() => (
                      <TableCell>
                        <Skeleton className="h-10 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ) : (
                  <TableRow key={index}>
                    <TableCell className=" flex items-center gap-2 size-14 items-center"><img src={item.images[0]} alt="profuct image" title={item.name} className="h-full w-10 rounded-md shadow-md " />{item.name}</TableCell>
                    <TableCell>{item.category.name}</TableCell>
                    <TableCell>PKR {item.price}</TableCell>
                    <TableCell>{item.status}</TableCell>
                    <TableCell>
                      <Button variant={"ghost"}>
                        <HugeiconsIcon icon={Dots} className="rotate-90 " />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              }
            />
          </CardContent>
        </Card>
        <Card className="w-60">
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
