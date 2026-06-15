import type authClient from "@/lib/auth";
import type { IconSvgElement } from "@hugeicons/react";

export type Role = "STORE_ADMIN" | "SUPER_ADMIN" | "CUSTOMER";

export type MenuItem = {
  to: string;
  icon: IconSvgElement;
  label: string;
};

export type dropdownItem = {
  to?: string;
  icon: IconSvgElement;
  label: string;
  variant?: "default" | "destructive";
  onClick?: () => void;
  isSeparator?: boolean;
  className?: string;
  key?: string;
};

export type dropdownMenuProps = {
  items: dropdownItem[];
  trigger: React.ReactNode;
  align?: "start" | "end";
  className?: string;
};

export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user;

export type TableColumn<T> = {
  key: string;
  title: string;
  render: (row: T) => React.ReactNode;
};

export type ApiResponse<T> = {
  status: number;
  message: string;
  data: T;
};
