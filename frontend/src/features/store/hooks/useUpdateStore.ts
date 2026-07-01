import { queryClient } from "@/api/query-client";
import { useMutation } from "@tanstack/react-query";
import { updateStoreProfile, updateStoreDelivery, updateStoreHours, updateStoreLogo, updateStoreBanner } from "../api/mutations";
import { toast } from "sonner";

export const useUpdateStoreProfile = () => {
  return useMutation({
    mutationFn: updateStoreProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store"] });
      toast.success("Profile updated successfully");
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });
};

export const useUpdateStoreDelivery = () => {
  return useMutation({
    mutationFn: updateStoreDelivery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store"] });
      toast.success("Delivery settings updated successfully");
    },
    onError: () => {
      toast.error("Failed to update delivery settings");
    },
  });
};

export const useUpdateStoreHours = () => {
  return useMutation({
    mutationFn: updateStoreHours,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store"] });
      toast.success("Business hours updated successfully");
    },
    onError: () => {
      toast.error("Failed to update business hours");
    },
  });
};

export const useUpdateStoreLogo = () => {
  return useMutation({
    mutationFn: updateStoreLogo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store"] });
      toast.success("Logo updated successfully");
    },
    onError: () => {
      toast.error("Failed to update logo");
    },
  });
};

export const useUpdateStoreBanner = () => {
  return useMutation({
    mutationFn: updateStoreBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store"] });
      toast.success("Banner updated successfully");
    },
    onError: () => {
      toast.error("Failed to update banner");
    },
  });
};
