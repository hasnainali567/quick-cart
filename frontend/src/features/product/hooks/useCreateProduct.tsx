import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../api/queries";
import { AxiosError } from "axios";
import type { CreateProductInput } from "@/types/product.types";

const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (body: CreateProductInput) => createProduct({ body }),
    onSuccess: () => {
      toast.success("Product created successfully");
      queryClient.invalidateQueries({ queryKey: ["store", "products"] });
      navigate("/store/products");
    },
    onError: (error: unknown) => {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Something went wrong");
      }
    },
  });
};

export default useCreateProduct;
