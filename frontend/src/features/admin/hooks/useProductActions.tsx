import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  approveProduct,
  rejectProduct,
  suspendProduct,
  setProductFeatured,
} from "../api/products";

export const useApproveProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => approveProduct(id),
    onSuccess: () => {
      toast.success("Product approved");
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to approve product"),
  });
};

export const useRejectProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => rejectProduct(id),
    onSuccess: () => {
      toast.success("Product rejected");
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to reject product"),
  });
};

export const useSuspendProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => suspendProduct(id),
    onSuccess: () => {
      toast.success("Product suspended");
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to suspend product"),
  });
};

export const useSetProductFeatured = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => setProductFeatured(id),
    onSuccess: () => {
      toast.success("Product set as featured");
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to set product as featured"),
  });
};
