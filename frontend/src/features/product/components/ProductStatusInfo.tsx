import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { StoreProducts } from "@/types/product.types";

type Props = {
  status: StoreProducts["status"];
  adminStatus: StoreProducts["adminStatus"];
  isActive: boolean;
  isFeatured?: boolean;
  isOrganic?: boolean;
};

const ProductStatusInfo = ({
  status,
  adminStatus,
  isActive,
  isFeatured,
  isOrganic,
}: Props) => {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: "bg-green-500/10 text-green-600",
      INACTIVE: "bg-gray-500/10 text-gray-600",
      OUT_OF_STOCK: "bg-red-500/10 text-red-600",
      DISCONTINUED: "bg-orange-500/10 text-orange-600",
      APPROVED: "bg-blue-500/10 text-blue-600",
      PENDING: "bg-yellow-500/10 text-yellow-600",
      REJECTED: "bg-red-500/10 text-red-600",
      SUSPENDED: "bg-gray-500/10 text-gray-600",
    };
    return colors[status] || "";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Status & Flags</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge className={getStatusColor(status)}>{status}</Badge>
          <Badge className={getStatusColor(adminStatus)} variant="outline">
            Admin: {adminStatus}
          </Badge>
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>

        <div className="flex gap-2">
          {isFeatured && (
            <Badge variant="outline" className="text-purple-600 border-purple-600">
              Featured
            </Badge>
          )}
          {isOrganic && (
            <Badge variant="outline" className="text-green-600 border-green-600">
              Organic
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductStatusInfo;
