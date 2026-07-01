import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  approveDriver,
  rejectDriver,
  suspendDriver,
} from "../api/drivers";

export const useApproveDriver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approveDriver(id),
    onSuccess: () => {
      toast.success("Driver approved");
      queryClient.invalidateQueries({ queryKey: ["admin", "drivers"] });
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to approve driver"),
  });
};

export const useRejectDriver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => rejectDriver(id),
    onSuccess: () => {
      toast.success("Driver rejected");
      queryClient.invalidateQueries({ queryKey: ["admin", "drivers"] });
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to reject driver"),
  });
};

export const useSuspendDriver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => suspendDriver(id),
    onSuccess: () => {
      toast.success("Driver suspended");
      queryClient.invalidateQueries({ queryKey: ["admin", "drivers"] });
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to suspend driver"),
  });
};
