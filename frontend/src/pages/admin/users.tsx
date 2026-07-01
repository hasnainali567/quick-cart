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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Table from "@/components/global/Table";
import { Pagination } from "@/features/product/components/Pagination";
import useGetAdminUsers from "@/features/admin/hooks/useGetAdminUsers";
import { useSuspendUser } from "@/features/admin/hooks/useSuspendUser";
import UserSheet from "@/features/admin/components/UserSheet";
import type { TableColumn } from "@/types";
import type { AdminUser } from "@/features/admin/api/users";
import { HugeiconsIcon } from "@hugeicons/react";
import { Visible, Pen, LoaderCircle } from "@hugeicons/core-free-icons";

const Users = () => {
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page")) || 1;
  const search = params.get("search") || "";
  const role = params.get("role") || "";
  const [searchInput, setSearchInput] = useState(search);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const { data, isPending } = useGetAdminUsers({ page, take: 10, search, role });
  const { mutate: toggleSuspend } = useSuspendUser();

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

  const handleSuspend = (user: AdminUser) => {
    setPendingId(user.id);
    toggleSuspend(
      { id: user.id, action: user.isSuspended ? "unsuspend" : "suspend" },
      { onSettled: () => setPendingId(null) },
    );
  };

  const columns: TableColumn<AdminUser>[] = [
    {
      key: "name",
      title: "Name",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-muted text-sm font-semibold shrink-0">
            {row.name?.charAt(0)?.toUpperCase() || "?"}
          </div>
          <div>
            <p className="text-sm font-medium">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      title: "Role",
      render: (row) => (
        <Badge>
          {row.role === "SUPER_ADMIN"
            ? "Admin"
            : row.role === "STORE_ADMIN"
              ? "Store Owner"
              : row.role === "DRIVER"
                ? "Driver"
                : "Customer"}
        </Badge>
      ),
    },
    {
      key: "phone",
      title: "Phone",
      render: (row) => (
        <span className="text-sm text-muted-foreground">{row.phone || "—"}</span>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (row) => {
        if (row.isSuspended) {
          return (
            <Badge variant="destructive" className="text-[11px]">
              Suspended
            </Badge>
          );
        }
        return (
          <div className="flex items-center gap-2">
            <span
              className={`size-2 rounded-full ${row.isActive ? "bg-green-500" : "bg-gray-300"}`}
            />
            <span className="text-sm">{row.isActive ? "Active" : "Inactive"}</span>
          </div>
        );
      },
    },
    {
      key: "joined",
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
          <UserSheet
            user={row}
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
              <DropdownMenuItem
                className={row.isSuspended ? "" : "text-destructive focus:text-destructive"}
                onClick={() => handleSuspend(row)}
              >
                {row.isSuspended ? "Unsuspend" : "Suspend"}
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
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage platform users
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 flex-wrap">
            <Input
              placeholder="Search name or email..."
              className="max-w-xs"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && updateParams({ search: searchInput })}
            />
            <Button variant="secondary" size="sm" onClick={() => updateParams({ search: searchInput })}>
              Search
            </Button>
            <Select
              value={role}
              onValueChange={(v) => updateParams({ role: v === "all" ? "" : v })}
            >
              <SelectTrigger className="w-32">
                <SelectValue placeholder="All roles" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="CUSTOMER">Customer</SelectItem>
                <SelectItem value="STORE_ADMIN">Store Owner</SelectItem>
                <SelectItem value="DRIVER">Driver</SelectItem>
                <SelectItem value="SUPER_ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <div className="py-8 text-center text-muted-foreground">Loading...</div>
          ) : !data || data.docs.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">No users found</div>
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

export default Users;
