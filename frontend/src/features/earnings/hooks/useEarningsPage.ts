import { useState } from "react";
import { useGetEarnings } from "./useGetEarnings";
import type { EarningsTimeRange } from "@/types/earnings.types";

export const useEarningsPage = () => {
  const [timeRange, setTimeRange] = useState<EarningsTimeRange>("30d");
  const { data, isLoading, isError } = useGetEarnings(timeRange);

  return {
    earnings: data,
    isLoading,
    isError,
    timeRange,
    setTimeRange,
  };
};
