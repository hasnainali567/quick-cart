import { useQuery } from "@tanstack/react-query";
import { getStoreProducts } from "../api/queries";

type Props = {
  page?: number;
  take?: number;
  filters?: {
    filter: string;
    value: string | "";
  }[];
};

const useGetStoreProducts = ({ page = 1, take = 10, filters }: Props) => {
  return useQuery({
    queryKey: ["store", "products", page, take, filters],
    queryFn: () => getStoreProducts({ page, take, filters: filters }),
    placeholderData: (prev) => prev,
  });
};

export default useGetStoreProducts;
