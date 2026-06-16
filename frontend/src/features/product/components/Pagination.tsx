import {
  Pagination as BasePagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { Paginate } from "@/types";

type Props = {
  paginate: Paginate;
  onPageChange: (page: number) => void;
};

export function Pagination({ paginate, onPageChange }: Props) {
  console.log("paginate", paginate);

  return (
    <BasePagination className="max-w-fit! mx-2!">
      <PaginationContent className="w-fit! mx-2!">
        <PaginationItem>
          <PaginationPrevious
            onClick={(e) => {
              e.preventDefault();
              paginate.prevPage && onPageChange(paginate.prevPage);
            }}
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink>{paginate.page}</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            onClick={(e) => {
              e.preventDefault();
              paginate.nextPage && onPageChange(paginate.nextPage);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </BasePagination>
  );
}
