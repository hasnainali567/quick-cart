import { useQuery } from "@tanstack/react-query";
import { getAdminStores } from "../api/stores";
import type { GetStoresParams } from "../api/stores";

const useGetAdminStores = (params: GetStoresParams) => {
  return useQuery({
    queryKey: ["admin", "stores", params],
    queryFn: () => getAdminStores(params),
    placeholderData: (prev) => prev,
  });
};

export default useGetAdminStores;
