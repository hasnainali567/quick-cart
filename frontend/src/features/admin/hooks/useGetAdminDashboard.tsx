import { useQuery } from "@tanstack/react-query";
import { getAdminDashboard } from "../api/queries";

const useGetAdminDashboard = () => {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: getAdminDashboard,
  });
};

export default useGetAdminDashboard;
