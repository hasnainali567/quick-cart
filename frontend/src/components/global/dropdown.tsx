import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import type { dropdownMenuProps } from "@/types";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

const Dropdown = ({ trigger, items, align, className }: dropdownMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align={align} className={className}>
        {items.map((item) => (
          <>
            {item.isSeparator && <DropdownMenuSeparator key={item.key} />}
            {item.onClick ? (
              <DropdownMenuItem asChild key={item.key}>
                <Button
                  onClick={item.onClick}
                  variant={item.variant}
                  className="w-full"
                >
                  <HugeiconsIcon icon={item.icon} />
                  {item.label}
                </Button>
              </DropdownMenuItem>
            ) : item.to ? (
              <DropdownMenuItem asChild key={item.key}>
                <Link to={item.to} className="flex items-center gap-2">
                  <HugeiconsIcon icon={item.icon} />
                  {item.label}
                </Link>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                key={item.key}
                className={item.className}
                variant={item.variant}
              >
                <HugeiconsIcon icon={item.icon} />
                {item.label}
              </DropdownMenuItem>
            )}
          </>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Dropdown;
