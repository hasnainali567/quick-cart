import { useQuery } from "@tanstack/react-query";
import { getAdminUsers } from "../api/users";
import type { GetUsersParams } from "../api/users";

const useGetAdminUsers = (params: GetUsersParams) => {
  return useQuery({
    queryKey: ["admin", "users", params],
    queryFn: () => getAdminUsers(params),
    placeholderData: (prev) => prev,
  });
};

export default useGetAdminUsers;
