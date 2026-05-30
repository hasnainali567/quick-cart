import type React from "react";
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const Table = ({
  heads,
  items,
  renderItem,
}: {
  heads: string[];
  items: [];
  renderItem: (item: unknown, index: number) => React.ReactNode;
}) => {
  return (
    <ShadcnTable>
      <TableHeader className="text-muted-foreground">
        {heads.map((head) => (
          <TableHead className="uppercase text-muted-foreground text-sm">{head}</TableHead>
        ))}
      </TableHeader>
      <TableBody>
        {items && items.map((item, index) => renderItem(item, index))}
      </TableBody>
    </ShadcnTable>
  );
};

export default Table;
