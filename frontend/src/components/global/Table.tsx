import React from "react";
import {
  Table as T,
  TableHeader,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";

type Column<T> = {
  key: string;
  title: string;
  render: (row: T) => React.ReactNode;
};

type Props<T> = {
  columns: Column<T>[];
  data: T[];
};

const Table = <T,>({ columns, data }: Props<T>) => {
  return (
    <T className="scrollbar-none">
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.key} className="uppercase font-medium">
              {col.title}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {data?.map((row, i) => (
          <TableRow key={i}>
            {columns.map((col) => (
              <TableCell key={col.key}>{col.render(row)}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </T>
  );
};

export default Table;
