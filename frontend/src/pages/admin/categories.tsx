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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Table from "@/components/global/Table";
import { Pagination } from "@/features/product/components/Pagination";
import useGetAdminCategories from "@/features/admin/hooks/useGetAdminCategories";
import {
  useToggleCategoryStatus,
  useDeleteCategory,
} from "@/features/admin/hooks/useCategoryActions";
import CategorySheet from "@/features/admin/components/CategorySheet";
import type { TableColumn } from "@/types";
import type { AdminCategory } from "@/features/admin/api/categories";
import { HugeiconsIcon } from "@hugeicons/react";
import { Visible, Pen, LoaderCircle } from "@hugeicons/core-free-icons";

const Categories = () => {
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page")) || 1;
  const search = params.get("search") || "";
  const isActive = params.get("isActive") || "";
  const [searchInput, setSearchInput] = useState(search);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data, isPending } = useGetAdminCategories({
    page,
    take: 10,
    search,
    isActive,
  });

  const { mutate: toggleStatus } = useToggleCategoryStatus();
  const { mutate: remove } = useDeleteCategory();

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

  const handleToggleStatus = (id: string) => {
    setPendingId(id);
    toggleStatus(id, { onSettled: () => setPendingId(null) });
  };

  const handleDelete = (id: string) => {
    setPendingId(id);
    remove(id, {
      onSettled: () => {
        setPendingId(null);
        setDeletingId(null);
      },
    });
  };

  const columns: TableColumn<AdminCategory>[] = [
    {
      key: "name",
      title: "Category",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-sm font-bold shrink-0 overflow-hidden">
            {row.image ? (
              <img
                src={row.image}
                alt={row.name}
                className="size-full object-cover"
              />
            ) : row.icon ? (
              <span className="text-base">{row.icon}</span>
            ) : (
              row.name?.charAt(0)?.toUpperCase() || "?"
            )}
          </div>
          <div>
            <p className="text-sm font-medium">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "sortOrder",
      title: "Order",
      render: (row) => (
        <span className="text-sm tabular-nums">{row.sortOrder}</span>
      ),
    },
    {
      key: "isActive",
      title: "Status",
      render: (row) => (
        <Badge variant={row.isActive ? "default" : "secondary"}>
          {row.isActive ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "createdAt",
      title: "Created",
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
          <CategorySheet
            category={row}
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
              <DropdownMenuItem onClick={() => handleToggleStatus(row.id)}>
                {row.isActive ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setDeletingId(row.id)}
              >
                Delete
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
        <h1 className="text-3xl font-bold">Categories</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage product categories
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 flex-wrap">
            <Input
              placeholder="Search categories..."
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
              value={isActive}
              onValueChange={(v) =>
                updateParams({ isActive: v === "all" ? "" : v })
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="true">Active</SelectItem>
                <SelectItem value="false">Inactive</SelectItem>
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
              No categories found
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

      {/* Delete confirmation dialog */}
      <Dialog
        open={deletingId !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingId(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this category? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={pendingId === deletingId}
              onClick={() => deletingId && handleDelete(deletingId)}
            >
              {pendingId === deletingId ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Categories;
