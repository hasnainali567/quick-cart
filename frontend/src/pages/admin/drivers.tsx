import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Table from "@/components/global/Table";
import { Pagination } from "@/features/product/components/Pagination";
import useGetAdminDrivers from "@/features/admin/hooks/useGetAdminDrivers";
import {
  useApproveDriver,
  useRejectDriver,
  useSuspendDriver,
} from "@/features/admin/hooks/useDriverActions";
import DriverSheet from "@/features/admin/components/DriverSheet";
import type { TableColumn } from "@/types";
import type { AdminDriver } from "@/features/admin/api/drivers";
import { HugeiconsIcon } from "@hugeicons/react";
import { Visible, Pen, LoaderCircle } from "@hugeicons/core-free-icons";

const approvalStatusBadge = (status: string) => {
  switch (status) {
    case "APPROVED":
      return <Badge className="bg-green-500">{status}</Badge>;
    case "PENDING":
      return <Badge className="bg-yellow-500">{status}</Badge>;
    case "SUSPENDED":
      return <Badge variant="destructive">{status}</Badge>;
    case "REJECTED":
      return (
        <Badge variant="destructive" className="bg-red-500">
          {status}
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

const statusBadge = (status: string) => {
  switch (status) {
    case "ONLINE":
      return (
        <Badge className="bg-green-500 text-white text-xs">{status}</Badge>
      );
    case "ON_DELIVERY":
      return (
        <Badge className="bg-blue-500 text-white text-xs">{status}</Badge>
      );
    case "OFFLINE":
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const Drivers = () => {
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page")) || 1;
  const search = params.get("search") || "";
  const approvalStatus = params.get("approvalStatus") || "";
  const status = params.get("status") || "";
  const [searchInput, setSearchInput] = useState(search);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const { data, isPending } = useGetAdminDrivers({
    page,
    take: 10,
    search,
    approvalStatus,
    status,
  });

  const { mutate: approve } = useApproveDriver();
  const { mutate: reject } = useRejectDriver();
  const { mutate: suspend } = useSuspendDriver();

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      setParams((prev) => {
        const next = new URLSearchParams(prev);
        Object.entries(updates).forEach(([k, v]) => {
          if (v) next.set(k, v);
          else next.delete(k);
        });
        next.set("page", "1");
        return next;
      });
    },
    [setParams],
  );

  const handleApprove = (id: string) => {
    setPendingId(id);
    approve(id, { onSettled: () => setPendingId(null) });
  };

  const handleReject = (id: string) => {
    setPendingId(id);
    reject(id, { onSettled: () => setPendingId(null) });
  };

  const handleSuspend = (id: string) => {
    setPendingId(id);
    suspend(id, { onSettled: () => setPendingId(null) });
  };

  const columns: TableColumn<AdminDriver>[] = [
    {
      key: "name",
      title: "Driver",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-full bg-muted text-sm font-bold shrink-0 overflow-hidden">
            {row.user?.image ? (
              <img
                src={row.user.image}
                alt={row.user.name}
                className="size-full object-cover"
              />
            ) : (
              row.user?.name?.charAt(0)?.toUpperCase() || "?"
            )}
          </div>
          <div>
            <p className="text-sm font-medium">{row.user?.name}</p>
            <p className="text-xs text-muted-foreground">{row.user?.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "phone",
      title: "Phone",
      render: (row) => (
        <span className="text-sm tabular-nums">
          {row.user?.phone || "—"}
        </span>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (row) => statusBadge(row.status),
    },
    {
      key: "approvalStatus",
      title: "Approval",
      render: (row) => approvalStatusBadge(row.approvalStatus),
    },
    {
      key: "totalDeliveries",
      title: "Deliveries",
      render: (row) => (
        <span className="text-sm tabular-nums">{row.totalDeliveries || 0}</span>
      ),
    },
    {
      key: "avgRating",
      title: "Rating",
      render: (row) => (
        <span className="text-sm tabular-nums">
          {row.avgRating ? row.avgRating.toFixed(1) : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      title: "",
      render: (row) => (
        <div className="flex items-center gap-0">
          <DriverSheet
            driver={row}
            trigger={
              <Button variant="ghost" size="sm">
                <HugeiconsIcon icon={Visible} />
              </Button>
            }
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" disabled={pendingId === row.id}>
                {pendingId === row.id ? (
                  <HugeiconsIcon
                    icon={LoaderCircle}
                    className="size-4 animate-spin"
                  />
                ) : (
                  <HugeiconsIcon icon={Pen} />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {row.approvalStatus !== "APPROVED" && (
                <DropdownMenuItem onClick={() => handleApprove(row.id)}>
                  Approve
                </DropdownMenuItem>
              )}
              {row.approvalStatus === "PENDING" && (
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => handleReject(row.id)}
                >
                  Reject
                </DropdownMenuItem>
              )}
              {row.approvalStatus !== "SUSPENDED" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => handleSuspend(row.id)}
                  >
                    Suspend
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <div className="flex-1 p-4 md:p-6 space-y-4 overflow-y-auto">
      <div>
        <h1 className="text-3xl font-bold">Drivers</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage delivery drivers
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 flex-wrap">
            <Input
              placeholder="Search by name or email..."
              className="max-w-xs"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && updateParams({ search: searchInput })
              }
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => updateParams({ search: searchInput })}
            >
              Search
            </Button>
            <Select
              value={approvalStatus}
              onValueChange={(v) =>
                updateParams({ approvalStatus: v === "all" ? "" : v })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All approval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All approval</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={status}
              onValueChange={(v) =>
                updateParams({ status: v === "all" ? "" : v })
              }
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="ONLINE">Online</SelectItem>
                <SelectItem value="OFFLINE">Offline</SelectItem>
                <SelectItem value="ON_DELIVERY">On Delivery</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <div className="py-8 text-center text-muted-foreground">
              Loading...
            </div>
          ) : !data || data.docs.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No drivers found
            </div>
          ) : (
            <>
              <Table columns={columns} data={data.docs} />
              <div className="mt-4 flex justify-end">
                <Pagination
                  paginate={data}
                  onPageChange={(p) =>
                    setParams((prev) => {
                      const next = new URLSearchParams(prev);
                      next.set("page", String(p));
                      return next;
                    })
                  }
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Drivers;
