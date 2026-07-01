import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  toggleCategoryStatus,
  deleteCategory,
} from "../api/categories";

export const useToggleCategoryStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => toggleCategoryStatus(id),
    onSuccess: () => {
      toast.success("Category status updated");
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to update category status"),
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      toast.success("Category deleted");
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to delete category"),
  });
};
