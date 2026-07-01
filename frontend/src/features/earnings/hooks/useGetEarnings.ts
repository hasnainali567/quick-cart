import { useQuery } from "@tanstack/react-query";
import { getEarnings } from "../api/queries";
import type { EarningsTimeRange } from "@/types/earnings.types";

export const useGetEarnings = (range: EarningsTimeRange) => {
  return useQuery({
    queryKey: ["earnings", range],
    queryFn: () => getEarnings(range),
  });
};
