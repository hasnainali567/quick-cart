import Sheet from "@/components/global/Sheet";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { AdminStore } from "../api/stores";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tick } from "@hugeicons/core-free-icons";

type Props = {
  store: AdminStore;
  trigger: React.ReactNode;
};

const partnerStatusColor = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "bg-green-500";
    case "PENDING":
      return "bg-yellow-500";
    case "SUSPENDED":
      return "bg-red-500";
    case "REJECTED":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const StoreSheet = ({ store, trigger }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet
      data={store}
      title={store.name}
      description={`Joined ${new Date(store.createdAt).toLocaleDateString()}`}
      onOpenChange={setOpen}
      open={open}
      trigger={trigger}
    >
      {(data) => (
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto px-4 space-y-4 pb-6 scrollbar-none">
            {/* Logo + Name */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex size-16 items-center justify-center rounded-full bg-muted text-2xl font-bold shrink-0">
                {data.logo ? (
                  <img src={data.logo} alt={data.name} className="size-full rounded-full object-cover" />
                ) : (
                  data.name?.charAt(0)?.toUpperCase() || "?"
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold">{data.name}</h2>
                  {data.isVerified && (
                    <HugeiconsIcon icon={Tick} className="size-5 text-blue-500" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{data.slug}</p>
              </div>
            </div>

            <Separator />

            {/* Status */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Partner Status</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className={`size-2 rounded-full ${partnerStatusColor(data.partnerStatus)}`} />
                    <Badge>{data.partnerStatus}</Badge>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Store Status</p>
                  <Badge variant={data.status === "OPEN" ? "default" : "secondary"}>
                    {data.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Verified</p>
                  <p className="text-sm font-medium mt-1">
                    {data.isVerified ? "Yes" : "No"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Commission</p>
                  <p className="text-sm font-medium mt-1">{data.commissionPercent}%</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Performance */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Performance
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-2xl font-bold">{data.totalOrders}</p>
                  <p className="text-xs text-muted-foreground">Orders</p>
                </div>
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-2xl font-bold">
                    ${(data.totalRevenue || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                </div>
                <div className="rounded-lg bg-muted p-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <p className="text-2xl font-bold">
                      {data.avgRating ? data.avgRating.toFixed(1) : "—"}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Owner */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Owner
              </h3>
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-semibold shrink-0">
                  {data.owner?.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div>
                  <p className="text-sm font-medium">{data.owner?.name}</p>
                  <p className="text-xs text-muted-foreground">{data.owner?.email}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* IDs */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Identifiers
              </h3>
              <div>
                <p className="text-xs text-muted-foreground">Store ID</p>
                <p className="text-sm font-mono mt-0.5 break-all">{data.id}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Sheet>
  );
};

export default StoreSheet;
