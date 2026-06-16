import { useQuery } from "@tanstack/react-query";
import { getStoreProducts } from "../api/queries";

type Props = {
  page?: number;
  take?: number;
};

const useGetStoreProducts = ({ page = 0, take = 10 }: Props) => {
  return useQuery({
    queryKey: ["store", "products", page, take],
    queryFn: () => getStoreProducts({ page, take }),
  });
};

export default useGetStoreProducts;
