import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  approveStore,
  rejectStore,
  verifyStore,
  suspendStore,
  updateStoreCommission,
} from "../api/stores";

export const useApproveStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approveStore(id),
    onSuccess: () => {
      toast.success("Store approved");
      queryClient.invalidateQueries({ queryKey: ["admin", "stores"] });
    },
    onError: (err: Error) => toast.error(err.message || "Failed to approve store"),
  });
};

export const useRejectStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      rejectStore(id, reason),
    onSuccess: () => {
      toast.success("Store rejected");
      queryClient.invalidateQueries({ queryKey: ["admin", "stores"] });
    },
    onError: (err: Error) => toast.error(err.message || "Failed to reject store"),
  });
};

export const useVerifyStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => verifyStore(id),
    onSuccess: () => {
      toast.success("Store verified");
      queryClient.invalidateQueries({ queryKey: ["admin", "stores"] });
    },
    onError: (err: Error) => toast.error(err.message || "Failed to verify store"),
  });
};

export const useSuspendStore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => suspendStore(id),
    onSuccess: () => {
      toast.success("Store suspended");
      queryClient.invalidateQueries({ queryKey: ["admin", "stores"] });
    },
    onError: (err: Error) => toast.error(err.message || "Failed to suspend store"),
  });
};

export const useUpdateCommission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, commissionPercent }: { id: string; commissionPercent: number }) =>
      updateStoreCommission(id, commissionPercent),
    onSuccess: () => {
      toast.success("Commission updated");
      queryClient.invalidateQueries({ queryKey: ["admin", "stores"] });
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to update commission"),
  });
};
