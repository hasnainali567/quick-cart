import { queryClient } from "@/api/query-client";
import { useMutation } from "@tanstack/react-query";
import { updateStoreStatus } from "../api/mutations";

const useUpdateStoreStatus = () => {
  return useMutation({
    mutationKey: ["store", "status"],
    mutationFn: ({ id }: { id: string }) => updateStoreStatus(id),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["store", "status"],
      });
      const previousStoreStatus = queryClient.getQueryData(["store", "status"]);
      return { previousStoreStatus };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["store"] });
    },
    onError: (err, variables, context) => {
      if (context?.previousStoreStatus) {
        queryClient.setQueryData(
          ["store", "status"],
          context.previousStoreStatus,
        );
      }
    },
  });
};

export default useUpdateStoreStatus;
