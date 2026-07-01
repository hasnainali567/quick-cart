import Sheet from "@/components/global/Sheet";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { AdminDriver } from "../api/drivers";

type Props = {
  driver: AdminDriver;
  trigger: React.ReactNode;
};

const approvalStatusColor = (status: string) => {
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

const statusColor = (status: string) => {
  switch (status) {
    case "ONLINE":
      return "bg-green-500";
    case "OFFLINE":
      return "bg-gray-500";
    case "ON_DELIVERY":
      return "bg-blue-500";
    default:
      return "bg-gray-500";
  }
};

const DriverSheet = ({ driver, trigger }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet
      data={driver}
      title={driver.user?.name || "Driver"}
      description={`Joined ${new Date(driver.createdAt).toLocaleDateString()}`}
      onOpenChange={setOpen}
      open={open}
      trigger={trigger}
    >
      {(data) => (
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto px-4 space-y-4 pb-6 scrollbar-none">
            {/* Avatar + Name */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex size-16 items-center justify-center rounded-full bg-muted text-2xl font-bold shrink-0 overflow-hidden">
                {data.user?.image ? (
                  <img
                    src={data.user.image}
                    alt={data.user.name}
                    className="size-full object-cover"
                  />
                ) : (
                  data.user?.name?.charAt(0)?.toUpperCase() || "?"
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{data.user?.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {data.user?.email}
                </p>
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
                  <p className="text-xs text-muted-foreground">Driver Status</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={`size-2 rounded-full ${statusColor(data.status)}`}
                    />
                    <Badge>{data.status}</Badge>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Approval Status
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={`size-2 rounded-full ${approvalStatusColor(data.approvalStatus)}`}
                    />
                    <Badge>{data.approvalStatus}</Badge>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Vehicle */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Vehicle
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Type</p>
                  <p className="text-sm font-medium mt-1">
                    {data.vehicleType || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="text-sm font-medium mt-1">
                    {data.vehicleName || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Number</p>
                  <p className="text-sm font-medium mt-1">
                    {data.vehicleNumber || "—"}
                  </p>
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
                  <p className="text-2xl font-bold">
                    {data.totalDeliveries || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Deliveries</p>
                </div>
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-2xl font-bold">
                    {data.avgRating ? data.avgRating.toFixed(1) : "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-2xl font-bold">
                    ${(data.totalEarnings || 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">Earnings</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Contact
              </h3>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium mt-0.5">
                  {data.user?.email || "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-medium mt-0.5">
                  {data.user?.phone || "—"}
                </p>
              </div>
            </div>

            <Separator />

            {/* IDs */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Identifiers
              </h3>
              <div>
                <p className="text-xs text-muted-foreground">Driver ID</p>
                <p className="text-sm font-mono mt-0.5 break-all">{data.id}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Sheet>
  );
};

export default DriverSheet;
