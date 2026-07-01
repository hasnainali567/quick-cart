import { useMutation, useQueryClient } from "@tanstack/react-query";
import { suspendUser, unsuspendUser } from "../api/users";
import { toast } from "sonner";

export const useSuspendUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: "suspend" | "unsuspend" }) =>
      action === "suspend" ? suspendUser(id) : unsuspendUser(id),
    onSuccess: (_data, variables) => {
      toast.success(variables.action === "suspend" ? "User suspended" : "User unsuspended");
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update user");
    },
  });
};
