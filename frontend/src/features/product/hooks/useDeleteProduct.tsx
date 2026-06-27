import { deleteProduct } from "@/features/product/api/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProduct({ id }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["store", "products"] });
    },
  });
};

export default useDeleteProduct;
