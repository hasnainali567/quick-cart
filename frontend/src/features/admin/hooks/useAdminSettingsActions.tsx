import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  updateAdminSetting,
  createAdminSetting,
  bulkUpdateAdminSettings,
} from "../api/settings";

export const useUpdateAdminSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value, description }: { key: string; value: string; description?: string }) =>
      updateAdminSetting(key, value, description),
    onSuccess: () => {
      toast.success("Setting updated");
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to update setting"),
  });
};

export const useCreateAdminSetting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value, description }: { key: string; value: string; description?: string }) =>
      createAdminSetting(key, value, description),
    onSuccess: () => {
      toast.success("Setting created");
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to create setting"),
  });
};

export const useBulkUpdateAdminSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: Array<{ key: string; value: string; description?: string }>) =>
      bulkUpdateAdminSettings(settings),
    onSuccess: () => {
      toast.success("Settings updated");
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
    },
    onError: (err: Error) =>
      toast.error(err.message || "Failed to update settings"),
  });
};