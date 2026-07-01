import Sheet from "@/components/global/Sheet";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import type { AdminUser } from "../api/users";

type Props = {
  user: AdminUser;
  trigger: React.ReactNode;
};

const UserSheet = ({ user, trigger }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet
      data={user}
      title={user.name}
      description={`Joined ${new Date(user.createdAt).toLocaleDateString()}`}
      onOpenChange={setOpen}
      open={open}
      trigger={trigger}
    >
      {(data) => (
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto px-4 space-y-4 pb-6 scrollbar-none">
            {/* Avatar + Name */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex size-16 items-center justify-center rounded-full bg-muted text-2xl font-bold shrink-0">
                {data.name?.charAt(0)?.toUpperCase() || "?"}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{data.name}</h2>
                <p className="text-sm text-muted-foreground">{data.email}</p>
              </div>
            </div>

            <Separator />

            {/* Account Details */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Account Details
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Role</p>
                  <Badge className="mt-1">
                    {data.role === "SUPER_ADMIN"
                      ? "Admin"
                      : data.role === "STORE_ADMIN"
                        ? "Store Owner"
                        : data.role === "DRIVER"
                          ? "Driver"
                          : "Customer"}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <div className="mt-1 flex items-center gap-2">
                    {data.isSuspended ? (
                      <Badge variant="destructive">Suspended</Badge>
                    ) : (
                      <Badge>{data.isActive ? "Active" : "Inactive"}</Badge>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium mt-1">
                    {data.phone || "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email Verified</p>
                  <p className="text-sm font-medium mt-1">Yes</p>
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
                <p className="text-xs text-muted-foreground">User ID</p>
                <p className="text-sm font-mono mt-0.5 break-all">{data.id}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </Sheet>
  );
};

export default UserSheet;
