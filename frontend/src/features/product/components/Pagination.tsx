import {
  Pagination as BasePagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import type { Paginate } from "@/types";

type Props = {
  paginate: Paginate;
  onPageChange: (page: number) => void;
};

export const getPageRange = (
  page: number,
  totalPages: number,
  siblingCount = 3,
) => {
  const start = Math.max(1, page - siblingCount);
  const end = Math.min(totalPages, page + siblingCount);

  const pages = [];

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
};

export function Pagination({ paginate, onPageChange }: Props) {
  return (
    <BasePagination className="max-w-fit! mx-2!">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            className={cn(
              !paginate.hasPrevPage ? "pointer-events-none opacity-50" : "",
            )}
            onClick={(e) => {
              e.preventDefault();
              if (paginate.hasPrevPage && paginate.prevPage) {
                onPageChange(paginate.prevPage);
              }
            }}
          />
        </PaginationItem>
        {getPageRange(paginate.page, paginate.totalPages).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              isActive={paginate.page === page}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(page);
              }}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            className={cn(
              !paginate.hasNextPage ? "pointer-events-none opacity-50" : "",
            )}
            onClick={(e) => {
              e.preventDefault();
              if (paginate.hasNextPage && paginate.nextPage) {
                onPageChange(paginate.nextPage);
              }
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </BasePagination>
  );
}
