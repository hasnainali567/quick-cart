import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCategorytoStore } from "../api/queries";
import type { AddedStoreCategory } from "@/types/store.types";

type UseAddCategorytoStoreProps = {
  onSuccess?: (data: AddedStoreCategory) => void;
  onError?: (error: Error) => void;
};

export const useAddCategorytoStore = ({
  onSuccess,
  onError,
}: UseAddCategorytoStoreProps) => {
  const queryClient = useQueryClient();
  return useMutation<AddedStoreCategory, Error, { id: string }>({
    mutationFn: (data) => addCategorytoStore(data),
    onSuccess: async (data) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["categories", "all"],
        }),
        queryClient.invalidateQueries({ queryKey: ["store", "categories"] }),
      ]);
      onSuccess?.(data);
    },
    onError: onError,
  });
};
