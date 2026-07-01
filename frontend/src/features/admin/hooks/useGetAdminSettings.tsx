import { useQuery } from "@tanstack/react-query";
import { getAdminSettings } from "../api/settings";
import type { GetSettingsParams } from "../api/settings";

const useGetAdminSettings = (params: GetSettingsParams = {}) => {
  return useQuery({
    queryKey: ["admin", "settings", params],
    queryFn: () => getAdminSettings(params),
    placeholderData: (prev) => prev,
  });
};

export default useGetAdminSettings;