import { useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import useGetAdminProducts from "@/features/admin/hooks/useGetAdminProducts";
import {
  useApproveProduct,
  useRejectProduct,
  useSuspendProduct,
  useSetProductFeatured,
} from "@/features/admin/hooks/useProductActions";
import ProductSheet from "@/features/admin/components/ProductSheet";
import type { TableColumn } from "@/types";
import type { AdminProduct } from "@/features/admin/api/products";
import { HugeiconsIcon } from "@hugeicons/react";
import { Visible, Pen, LoaderCircle } from "@hugeicons/core-free-icons";

const adminStatusBadge = (status: string) => {
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

const Products = () => {
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page")) || 1;
  const status = params.get("status") || "";
  const inStock = params.get("inStock") || "";
  const [pendingId, setPendingId] = useState<string | null>(null);

  const { data, isPending } = useGetAdminProducts({
    page,
    take: 10,
    status,
    inStock,
  });

  const { mutate: approve } = useApproveProduct();
  const { mutate: reject } = useRejectProduct();
  const { mutate: suspend } = useSuspendProduct();
  const { mutate: setFeatured } = useSetProductFeatured();

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

  const handleSetFeatured = (id: string) => {
    setPendingId(id);
    setFeatured(id, { onSettled: () => setPendingId(null) });
  };

  const columns: TableColumn<AdminProduct>[] = [
    {
      key: "name",
      title: "Product",
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-sm font-bold shrink-0 overflow-hidden">
            {row.images?.[0] ? (
              <img
                src={row.images[0]}
                alt={row.name}
                className="size-full object-cover"
              />
            ) : (
              row.name?.charAt(0)?.toUpperCase() || "?"
            )}
          </div>
          <div>
            <p className="text-sm font-medium max-w-48 truncate">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "store",
      title: "Store",
      render: (row) => (
        <span className="text-sm">{row.store?.name || "—"}</span>
      ),
    },
    {
      key: "category",
      title: "Category",
      render: (row) => (
        <span className="text-sm text-muted-foreground">
          {row.category?.name || "—"}
        </span>
      ),
    },
    {
      key: "price",
      title: "Price",
      render: (row) => (
        <div className="text-sm tabular-nums">
          {row.salePrice ? (
            <span className="text-green-600 font-medium">
              ${row.salePrice.toFixed(2)}
            </span>
          ) : (
            <span>${row.price.toFixed(2)}</span>
          )}
        </div>
      ),
    },
    {
      key: "stock",
      title: "Stock",
      render: (row) => (
        <span className="text-sm tabular-nums">{row.stock}</span>
      ),
    },
    {
      key: "adminStatus",
      title: "Status",
      render: (row) => adminStatusBadge(row.adminStatus),
    },
    {
      key: "actions",
      title: "",
      render: (row) => (
        <div className="flex items-center gap-0">
          <ProductSheet
            product={row}
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
              {row.adminStatus !== "APPROVED" && (
                <DropdownMenuItem onClick={() => handleApprove(row.id)}>
                  Approve
                </DropdownMenuItem>
              )}
              {row.adminStatus !== "REJECTED" && (
                <DropdownMenuItem onClick={() => handleReject(row.id)}>
                  Reject
                </DropdownMenuItem>
              )}
              {row.adminStatus !== "SUSPENDED" ? (
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => handleSuspend(row.id)}
                >
                  Suspend
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuSeparator />
              {!row.isFeatured && (
                <DropdownMenuItem onClick={() => handleSetFeatured(row.id)}>
                  Set Featured
                </DropdownMenuItem>
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
        <h1 className="text-3xl font-bold">Products</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage all platform products
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 flex-wrap">
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
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={inStock}
              onValueChange={(v) =>
                updateParams({ inStock: v === "all" ? "" : v })
              }
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="All stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All stock</SelectItem>
                <SelectItem value="true">In Stock</SelectItem>
                <SelectItem value="false">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <div className="py-8 text-center text-muted-foreground">
              Loading...
            </div>
          ) : !data || data.docs?.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No products found
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

export default Products;
