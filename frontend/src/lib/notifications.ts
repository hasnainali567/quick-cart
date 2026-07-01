import { ShoppingBag, Truck, Star, AlertCircle, Bell } from "@hugeicons/core-free-icons";
import type { Notification, NotificationType } from "@/types/notification.types";

export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "ORDER_PLACED",
    title: "New Order Received",
    body: "Order #1024 has been placed — 3 items, PKR 1,250",
    isRead: false,
    createdAt: "2026-06-30T10:23:00Z",
  },
  {
    id: "2",
    type: "DRIVER_ASSIGNED",
    title: "Driver Assigned",
    body: "Ahmed has been assigned to deliver order #1024",
    isRead: false,
    createdAt: "2026-06-30T10:20:00Z",
  },
  {
    id: "3",
    type: "ORDER_DELIVERED",
    title: "Order Delivered",
    body: "Order #1021 was delivered successfully — PKR 890 earned",
    isRead: true,
    createdAt: "2026-06-30T08:00:00Z",
  },
  {
    id: "4",
    type: "NEW_REVIEW",
    title: "New 5-Star Review",
    body: "Sarah left a 5-star review: 'Fresh produce, fast delivery!'",
    isRead: true,
    createdAt: "2026-06-30T06:00:00Z",
  },
  {
    id: "5",
    type: "LOW_STOCK",
    title: "Low Stock Alert",
    body: "Apples (Green) — only 2 units remaining. Restock soon.",
    isRead: false,
    createdAt: "2026-06-30T04:00:00Z",
  },
  {
    id: "6",
    type: "ORDER_CONFIRMED",
    title: "Order Confirmed",
    body: "Order #1020 has been confirmed and is being prepared",
    isRead: true,
    createdAt: "2026-06-29T22:00:00Z",
  },
  {
    id: "7",
    type: "ORDER_CANCELLED",
    title: "Order Cancelled",
    body: "Order #1019 was cancelled by customer — PKR 0 earned",
    isRead: false,
    createdAt: "2026-06-29T20:00:00Z",
  },
  {
    id: "8",
    type: "PROMO_CREATED",
    title: "Promotion Active",
    body: "Your 'Summer Sale' promotion is now live on the platform",
    isRead: true,
    createdAt: "2026-06-29T12:00:00Z",
  },
  {
    id: "9",
    type: "WITHDRAWAL_APPROVED",
    title: "Withdrawal Approved",
    body: "Your withdrawal of PKR 15,000 has been approved and processed",
    isRead: false,
    createdAt: "2026-06-28T14:00:00Z",
  },
  {
    id: "10",
    type: "ORDER_READY",
    title: "Order Ready for Pickup",
    body: "Order #1018 is ready — hand it over to the driver",
    isRead: true,
    createdAt: "2026-06-28T11:00:00Z",
  },
];

export const typeIcon: Record<NotificationType, typeof Bell> = {
  ORDER_PLACED: ShoppingBag,
  ORDER_CONFIRMED: ShoppingBag,
  ORDER_REJECTED: AlertCircle,
  ORDER_READY: ShoppingBag,
  DRIVER_ASSIGNED: Truck,
  ORDER_DELIVERED: Truck,
  ORDER_CANCELLED: AlertCircle,
  LOW_STOCK: AlertCircle,
  NEW_REVIEW: Star,
  PROMO_CREATED: Bell,
  WITHDRAWAL_APPROVED: Bell,
  WITHDRAWAL_REJECTED: AlertCircle,
  ACCOUNT_SUSPENDED: AlertCircle,
};

export const timeAgo = (dateStr: string): string => {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} minute${mins > 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return new Date(dateStr).toLocaleDateString();
};
