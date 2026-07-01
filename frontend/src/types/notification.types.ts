export type NotificationType =
  | "ORDER_PLACED"
  | "ORDER_CONFIRMED"
  | "ORDER_REJECTED"
  | "ORDER_READY"
  | "DRIVER_ASSIGNED"
  | "ORDER_DELIVERED"
  | "ORDER_CANCELLED"
  | "LOW_STOCK"
  | "NEW_REVIEW"
  | "PROMO_CREATED"
  | "WITHDRAWAL_APPROVED"
  | "WITHDRAWAL_REJECTED"
  | "ACCOUNT_SUSPENDED";

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
};
