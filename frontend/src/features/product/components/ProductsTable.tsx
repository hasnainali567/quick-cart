import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { StoreProducts } from "@/types/product.types";
import Table from "@/components/global/Table";
import type { PaginatedApiResponse, TableColumn } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { StockIndicator } from "./StockIndicator";
import { Pagination } from "./Pagination";
import { Badge } from "@/components/ui/badge";
import { useSearchParams } from "react-router-dom";
import ProductActions from "./ProductActions";

type Props = PaginatedApiResponse<StoreProducts>;

const columns: TableColumn<StoreProducts>[] = [
  {
    key: "checkbox",
    title: "Select",
    render: () => <Checkbox />,
  },
  {
    key: "product",
    title: "Product",
    render: (row) => (
      <div className="flex items-center gap-2 ">
        <img
          loading="lazy"
          src={row.images[0]}
          alt={row.name}
          className="size-10 rounded-md shadow-2xs box-border border"
        />
        <div className="flex flex-col ">
          <span className="text-base font-medium ">{row.name}</span>
          <span className="text-xs font-light text-muted-foreground ">
            SLUG: {row.slug}
          </span>
        </div>
      </div>
    ),
  },
  {
    key: "category",
    title: "category",
    render: (row) => {
      return (
        <span className="text-base font-medium ">{row.category.name}</span>
      );
    },
  },
  {
    key: "price",
    title: "price",
    render: (row) => {
      return (
        <span className="text-base font-medium ">
          PKR {row.price.toFixed(2)}
        </span>
      );
    },
  },
  {
    key: "stock",
    title: "stock",
    render: (row) => (
      <StockIndicator stock={row.stock} lowStockAlert={row.lowStockAlert} />
    ),
  },
  {
    key: "status",
    title: "status",
    render: (row) => (
      <Badge
        variant={"default"}
        className={`capitalize ${
          row.status === "ACTIVE" ? "bg-[#4edea3]" : "bg-[#ffb4ab]"
        }`}
      >
        {row.status.toLowerCase()}
      </Badge>
    ),
  },
  {
    key: "actions",
    title: "Actions",
    render: (row) => <ProductActions slug={row.slug} id={row.id} />,
  },
];

const ProductsTable = ({ docs, ...pagination }: Props) => {
  const [, setSearchParams] = useSearchParams();

  const onPageChange = (page: number) => {
    setSearchParams((prev) => {
      const updated = new URLSearchParams(prev);
      updated.set("page", String(page));
      return updated;
    });
  };

  return (
    <Card className="h-full flex-1 flex flex-col overflow-y-auto relative pt-0 scrollbar-none">
      <CardHeader className="sticky top-0 bg-accent py-4 z-10 flex items-center justify-between">
        <CardTitle>Products</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <Table<StoreProducts> columns={columns} data={docs ?? []} />{" "}
      </CardContent>
      <CardFooter className="w-full flex items-center justify-between">
        <span className="text-nowrap">
          Showing {pagination.startIndex} to {pagination.endIndex} of{" "}
          {pagination.totalDocs} products
        </span>
        <Pagination paginate={pagination} onPageChange={onPageChange} />
      </CardFooter>
    </Card>
  );
};

export default ProductsTable;
