import { getRequest } from "@/api/requests";
import type { EarningsResponse, EarningsTimeRange } from "@/types/earnings.types";

export const getEarnings = async (range: EarningsTimeRange) => {
  return getRequest<EarningsResponse>({
    url: `/store/earnings?range=${range}`,
  });
};
