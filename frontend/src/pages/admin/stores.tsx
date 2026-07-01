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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Table from "@/components/global/Table";
import { Pagination } from "@/features/product/components/Pagination";
import useGetAdminStores from "@/features/admin/hooks/useGetAdminStores";
import {
  useApproveStore,
  useRejectStore,
  useVerifyStore,
  useSuspendStore,
  useUpdateCommission,
} from "@/features/admin/hooks/useStoreActions";
import StoreSheet from "@/features/admin/components/StoreSheet";
import type { TableColumn } from "@/types";
import type { AdminStore } from "@/features/admin/api/stores";
import { HugeiconsIcon } from "@hugeicons/react";
import { Visible, Pen, LoaderCircle, Tick } from "@hugeicons/core-free-icons";

const partnerStatusBadge = (status: string) => {
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

const Stores = () => {
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page")) || 1;
  const search = params.get("search") || "";
  const partnerStatus = params.get("partnerStatus") || "";
  const isVerified = params.get("isVerified") || "";
  const [searchInput, setSearchInput] = useState(search);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [commissioningId, setCommissioningId] = useState<string | null>(null);
  const [commissionPercent, setCommissionPercent] = useState("");

  const { data, isPending } = useGetAdminStores({
    page,
    take: 10,
    search,
    partnerStatus,
    isVerified,
  });

  const { mutate: approve } = useApproveStore();
  const { mutate: reject } = useRejectStore();
  const { mutate: verify } = useVerifyStore();
  const { mutate: suspend } = useSuspendStore();
  const { mutate: updateCommission } = useUpdateCommission();

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
    if (!rejectionReason.trim()) return;
    setPendingId(id);
    reject(
      { id, reason: rejectionReason },
      { onSettled: () => { setPendingId(null); setRejectingId(null); setRejectionReason(""); } },
    );
  };

  const handleVerify = (id: string) => {
    setPendingId(id);
    verify(id, { onSettled: () => setPendingId(null) });
  };

  const handleSuspend = (id: string) => {
    setPendingId(id);
    suspend(id, { onSettled: () => setPendingId(null) });
  };

  const handleCommission = (id: string) => {
    const val = parseFloat(commissionPercent);
    if (isNaN(val) || val < 0 || val > 100) return;
    setPendingId(id);
    updateCommission(
      { id, commissionPercent: val },
      {
        onSettled: () => {
          setPendingId(null);
          setCommissioningId(null);
          setCommissionPercent("");
        },
      },
    );
  };

  const columns: TableColumn<AdminStore>[] = [
    {
      key: "name",
      title: "Store",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-full bg-muted text-sm font-bold shrink-0 overflow-hidden">
            {row.logo ? (
              <img src={row.logo} alt={row.name} className="size-full object-cover" />
            ) : (
              row.name?.charAt(0)?.toUpperCase() || "?"
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-medium">{row.name}</p>
              {row.isVerified && (
                <HugeiconsIcon icon={Tick} className="size-4 text-blue-500" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">{row.owner?.name}</p>
          </div>
        </div>
      ),
    },
    {
      key: "partnerStatus",
      title: "Status",
      render: (row) => partnerStatusBadge(row.partnerStatus),
    },
    {
      key: "commissionPercent",
      title: "Comm.",
      render: (row) => (
        <span className="text-sm tabular-nums">{row.commissionPercent}%</span>
      ),
    },
    {
      key: "totalOrders",
      title: "Orders",
      render: (row) => (
        <span className="text-sm tabular-nums">{row.totalOrders}</span>
      ),
    },
    {
      key: "totalRevenue",
      title: "Revenue",
      render: (row) => (
        <span className="text-sm tabular-nums">
          ${(row.totalRevenue || 0).toLocaleString()}
        </span>
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
      key: "createdAt",
      title: "Joined",
      render: (row) => (
        <span className="text-sm text-muted-foreground">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      title: "",
      render: (row) => (
        <div className="flex items-center gap-0">
          <StoreSheet
            store={row}
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
                  <HugeiconsIcon icon={LoaderCircle} className="size-4 animate-spin" />
                ) : (
                  <HugeiconsIcon icon={Pen} />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!row.isVerified && (
                <DropdownMenuItem onClick={() => handleVerify(row.id)}>
                  Verify
                </DropdownMenuItem>
              )}
              {row.partnerStatus !== "APPROVED" && (
                <DropdownMenuItem onClick={() => handleApprove(row.id)}>
                  Approve
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => {
                  setRejectingId(row.id);
                  setRejectionReason("");
                }}
              >
                Reject
              </DropdownMenuItem>
              {row.partnerStatus !== "SUSPENDED" ? (
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => handleSuspend(row.id)}
                >
                  Suspend
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setCommissioningId(row.id);
                  setCommissionPercent(String(row.commissionPercent));
                }}
              >
                Change Commission
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];

  return (
    <div className="flex-1 p-4 md:p-6 space-y-4 overflow-y-auto">
      <div>
        <h1 className="text-3xl font-bold">Stores</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage partner stores
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 flex-wrap">
            <Input
              placeholder="Search store or owner..."
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
              value={partnerStatus}
              onValueChange={(v) =>
                updateParams({ partnerStatus: v === "all" ? "" : v })
              }
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={isVerified}
              onValueChange={(v) =>
                updateParams({ isVerified: v === "all" ? "" : v })
              }
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="All verified" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All verified</SelectItem>
                <SelectItem value="true">Verified</SelectItem>
                <SelectItem value="false">Unverified</SelectItem>
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
              No stores found
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

      {/* Rejection dialog */}
      <Dialog
        open={rejectingId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setRejectingId(null);
            setRejectionReason("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Store</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="reason">Rejection reason</Label>
            <Textarea
              id="reason"
              placeholder="Enter reason for rejection..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectingId(null);
                setRejectionReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={!rejectionReason.trim() || pendingId === rejectingId}
              onClick={() => rejectingId && handleReject(rejectingId)}
            >
              {pendingId === rejectingId ? "Rejecting..." : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Commission dialog */}
      <Dialog
        open={commissioningId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setCommissioningId(null);
            setCommissionPercent("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Commission</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Label htmlFor="commission">Commission percentage (0-100)</Label>
            <Input
              id="commission"
              type="number"
              min={0}
              max={100}
              placeholder="e.g. 15"
              value={commissionPercent}
              onChange={(e) => setCommissionPercent(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCommissioningId(null);
                setCommissionPercent("");
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={
                !commissionPercent ||
                pendingId === commissioningId
              }
              onClick={() => commissioningId && handleCommission(commissioningId)}
            >
              {pendingId === commissioningId ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Stores;
