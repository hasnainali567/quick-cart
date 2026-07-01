import { useQuery } from "@tanstack/react-query";
import { getAdminDrivers } from "../api/drivers";
import type { GetDriversParams } from "../api/drivers";

const useGetAdminDrivers = (params: GetDriversParams) => {
  return useQuery({
    queryKey: ["admin", "drivers", params],
    queryFn: () => getAdminDrivers(params),
    placeholderData: (prev) => prev,
  });
};

export default useGetAdminDrivers;
