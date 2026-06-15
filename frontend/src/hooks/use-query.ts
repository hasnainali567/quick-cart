import type { Store } from "@/types/store.types";
import type { StoreOrder } from "@/types/order.types";
import { useQuery } from "@tanstack/react-query";
import { getRequest } from "@/api/requests";

const useGetStore = () => {
  return useQuery<Store, Error>({
    queryKey: ["store"],
    queryFn: async () => await getRequest<Store>({ url: "/store" }),
  });
};

const useGetStoreProducts = () => {
  return useQuery({
    queryKey: ["store"],
    queryFn: () => {
      return {
        store: "store",
        dashboard: {
          orders: 10,
          products: 20,
          earnings: 30,
          settings: 40,
        },
      };
    },
  });
};

const useGetStoreOrders = ({ skip, take }: { skip: number; take: number }) => {
  return useQuery({
    queryKey: ["orders", skip, take],
    queryFn: async () =>
      getRequest<{
        orders: StoreOrder[];
        total: number;
      }>({ url: `/store/orders?skip=${skip}&take=${take}` }),
  });
};

const useGetStoreOrdersById = (orderId: string) => {
  return useQuery({
    queryKey: ["orders", orderId],
    queryFn: async () =>
      getRequest<StoreOrder>({ url: `/store/orders/${orderId}` }),
  });
};

export {
  useGetStore,
  useGetStoreProducts,
  useGetStoreOrders,
  useGetStoreOrdersById,
};
