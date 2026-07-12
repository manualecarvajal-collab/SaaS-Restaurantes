export interface AdminStats {
  ordersToday: number;
  ordersTrend: string;
  totalSales: number;
  salesTrend: string;
  pendingPayments: number;
  ordersInProgress: number;
  avgPrepTime: string;
}

export interface PendingPayment {
  id: string;
  orderNumber: string;
  tableNumber: number;
  itemsCount: number;
  amount: number;
  paymentMethod: string;
  dinerName: string;
  payerPhone: string;
  bankReference: string;
  elapsedMinutes: number;
}

export interface OrderStatus {
  status: string;
  count: number;
  percentage: number;
  color: string;
}

export interface Activity {
  id: string;
  message: string;
  timestamp: string;
  type: "order" | "payment" | "inventory" | "error";
}

export const mockAdminStats: AdminStats = {
  ordersToday: 142,
  ordersTrend: "+12% vs ayer",
  totalSales: 4250,
  salesTrend: "+8.5% vs ayer",
  pendingPayments: 8,
  ordersInProgress: 24,
  avgPrepTime: "18 min",
};

export const mockPendingPayments: PendingPayment[] = [
  {
    id: "pay-1",
    orderNumber: "#4092",
    tableNumber: 22,
    itemsCount: 4,
    amount: 85.5,
    paymentMethod: "Transfer",
    dinerName: "Carlos Mendoza",
    payerPhone: "0412-1234567",
    bankReference: "REF-001-20240722",
    elapsedMinutes: 12,
  },
  {
    id: "pay-2",
    orderNumber: "#4093",
    tableNumber: 5,
    itemsCount: 2,
    amount: 32.0,
    paymentMethod: "Cash",
    dinerName: "María García",
    payerPhone: "0414-7654321",
    bankReference: "REF-002-20240722",
    elapsedMinutes: 8,
  },
  {
    id: "pay-3",
    orderNumber: "#4094",
    tableNumber: 14,
    itemsCount: 3,
    amount: 54.75,
    paymentMethod: "Transfer",
    dinerName: "José López",
    payerPhone: "0426-9876543",
    bankReference: "MOVIL-54321",
    elapsedMinutes: 5,
  },
  {
    id: "pay-4",
    orderNumber: "#4095",
    tableNumber: 8,
    itemsCount: 1,
    amount: 18.5,
    paymentMethod: "Cash",
    dinerName: "Ana Martínez",
    payerPhone: "0416-1112233",
    bankReference: "REF-004-20240722",
    elapsedMinutes: 3,
  },
  {
    id: "pay-5",
    orderNumber: "#4096",
    tableNumber: 3,
    itemsCount: 6,
    amount: 120.0,
    paymentMethod: "Transfer",
    dinerName: "Pedro Sánchez",
    payerPhone: "0412-9988776",
    bankReference: "MOVIL-98765",
    elapsedMinutes: 15,
  },
];

export const mockOrderStatuses: OrderStatus[] = [
  { status: "Confirmadas", count: 64, percentage: 82, color: "#16A34A" },
  { status: "Canceladas", count: 14, percentage: 18, color: "#DC2626" },
];

export interface AdminOrder {
  id: string;
  orderNumber: string;
  tableNumber: number;
  dinerName: string;
  dinerPhone: string;
  itemsCount: number;
  total: number;
  status: OrderStatusType;
  paymentMethod: string;
  bankReference: string;
  createdAt: string;
  elapsed: string;
}

export type OrderStatusType = "CONFIRMED" | "CANCELLED";

export const orderStatusLabels: Record<OrderStatusType, string> = {
  CONFIRMED: "Confirmada",
  CANCELLED: "Cancelada",
};

export const orderStatusColors: Record<OrderStatusType, string> = {
  CONFIRMED:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

let _adminOrders: AdminOrder[] = [
  {
    id: "ord-4",
    orderNumber: "#4095",
    tableNumber: 8,
    dinerName: "Ana Martínez",
    dinerPhone: "0416-1112233",
    itemsCount: 1,
    total: 18.5,
    status: "CONFIRMED",
    paymentMethod: "Cash",
    bankReference: "REF-004-20240722",
    createdAt: "2026-07-22 19:15",
    elapsed: "20 min",
  },
  {
    id: "ord-9",
    orderNumber: "#4100",
    tableNumber: 2,
    dinerName: "Andrés Blanco",
    dinerPhone: "0426-0011223",
    itemsCount: 2,
    total: 36.0,
    status: "CANCELLED",
    paymentMethod: "Cash",
    bankReference: "N/A",
    createdAt: "2026-07-22 17:00",
    elapsed: "2h 35 min",
  },
];

let _pendingList: PendingPayment[] = [
  {
    id: "pay-1",
    orderNumber: "#4092",
    tableNumber: 22,
    itemsCount: 4,
    amount: 85.5,
    paymentMethod: "Transfer",
    dinerName: "Carlos Mendoza",
    payerPhone: "0412-1234567",
    bankReference: "REF-001-20240722",
    elapsedMinutes: 12,
  },
  {
    id: "pay-2",
    orderNumber: "#4093",
    tableNumber: 5,
    itemsCount: 2,
    amount: 32.0,
    paymentMethod: "Cash",
    dinerName: "María García",
    payerPhone: "0414-7654321",
    bankReference: "REF-002-20240722",
    elapsedMinutes: 8,
  },
  {
    id: "pay-3",
    orderNumber: "#4094",
    tableNumber: 14,
    itemsCount: 3,
    amount: 54.75,
    paymentMethod: "Transfer",
    dinerName: "José López",
    payerPhone: "0426-9876543",
    bankReference: "MOVIL-54321",
    elapsedMinutes: 5,
  },
  {
    id: "pay-4",
    orderNumber: "#4095",
    tableNumber: 8,
    itemsCount: 1,
    amount: 18.5,
    paymentMethod: "Cash",
    dinerName: "Ana Martínez",
    payerPhone: "0416-1112233",
    bankReference: "REF-004-20240722",
    elapsedMinutes: 3,
  },
  {
    id: "pay-5",
    orderNumber: "#4096",
    tableNumber: 3,
    itemsCount: 6,
    amount: 120.0,
    paymentMethod: "Transfer",
    dinerName: "Pedro Sánchez",
    payerPhone: "0412-9988776",
    bankReference: "MOVIL-98765",
    elapsedMinutes: 15,
  },
];

export function getOrders(): AdminOrder[] {
  return _adminOrders;
}

export function addOrder(order: AdminOrder) {
  _adminOrders = [..._adminOrders, order];
}

export function getPendingPayments(): PendingPayment[] {
  return _pendingList;
}

export function removePendingPayment(id: string) {
  _pendingList = _pendingList.filter((p) => p.id !== id);
}

export const mockActivities: Activity[] = [
  {
    id: "act-1",
    message: "Orden de Mesa 12 lista para servir.",
    timestamp: "hace 2 min",
    type: "order",
  },
  {
    id: "act-2",
    message: "Mesa 4 realizó una nueva orden ($45.00).",
    timestamp: "hace 15 min",
    type: "order",
  },
  {
    id: "act-3",
    message: "Alerta de inventario: Poco stock de Tomates.",
    timestamp: "hace 1 hora",
    type: "inventory",
  },
  {
    id: "act-4",
    message: "Pago fallido para Mesa 8.",
    timestamp: "hace 2 horas",
    type: "error",
  },
];
