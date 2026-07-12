export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const APP_NAME = "SaaS Restaurantes";

export const ORDER_STATUSES = ["CONFIRMED", "CANCELLED"] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const PAYMENT_STATUSES = [
  "PENDING",
  "VERIFIED",
  "REJECTED",
] as const;

export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
