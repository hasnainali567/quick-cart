import { useMutation, useQueryClient } from "@tanstack/react-query";
import { patchRequest } from "@/api/requests";
import { toast } from "sonner";

export const useAcceptOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) =>
      patchRequest({ url: `/store/orders/${orderId}/accept`, data: {} }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order accepted successfully");
    },
    onError: () => {
      toast.error("Failed to accept order");
    },
  });
};

export const useRejectOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) =>
      patchRequest({ url: `/store/orders/${orderId}/reject`, data: {} }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order rejected");
    },
    onError: () => {
      toast.error("Failed to reject order");
    },
  });
};

export const useMarkOrderPrepared = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) =>
      patchRequest({ url: `/store/orders/${orderId}/prepared`, data: {} }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order marked as prepared");
    },
    onError: () => {
      toast.error("Failed to mark order as prepared");
    },
  });
};
