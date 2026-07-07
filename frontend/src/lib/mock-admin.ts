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
  { status: "Completadas", count: 64, percentage: 45, color: "#7C3AED" },
  { status: "Preparando", count: 43, percentage: 30, color: "#8B5CF6" },
  { status: "Nuevas", count: 21, percentage: 15, color: "#D1D5DB" },
  { status: "Canceladas", count: 14, percentage: 10, color: "#E5E7EB" },
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

export type OrderStatusType =
  | "PENDING"
  | "PAYMENT_SENT"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "DELIVERED"
  | "CANCELLED";

export const orderStatusLabels: Record<OrderStatusType, string> = {
  PENDING: "Pendiente",
  PAYMENT_SENT: "Pago Enviado",
  CONFIRMED: "Confirmada",
  PREPARING: "Preparando",
  READY: "Lista",
  DELIVERED: "Entregada",
  CANCELLED: "Cancelada",
};

export const orderStatusColors: Record<OrderStatusType, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  PAYMENT_SENT:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  CONFIRMED:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  PREPARING:
    "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  READY:
    "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  DELIVERED:
    "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

export const mockAdminOrders: AdminOrder[] = [
  {
    id: "ord-1",
    orderNumber: "#4092",
    tableNumber: 22,
    dinerName: "Carlos Mendoza",
    dinerPhone: "0412-1234567",
    itemsCount: 4,
    total: 85.5,
    status: "PAYMENT_SENT",
    paymentMethod: "Transfer",
    bankReference: "REF-001-20240722",
    createdAt: "2026-07-22 19:23",
    elapsed: "12 min",
  },
  {
    id: "ord-2",
    orderNumber: "#4093",
    tableNumber: 5,
    dinerName: "María García",
    dinerPhone: "0414-7654321",
    itemsCount: 2,
    total: 32.0,
    status: "PAYMENT_SENT",
    paymentMethod: "Cash",
    bankReference: "REF-002-20240722",
    createdAt: "2026-07-22 19:27",
    elapsed: "8 min",
  },
  {
    id: "ord-3",
    orderNumber: "#4094",
    tableNumber: 14,
    dinerName: "José López",
    dinerPhone: "0426-9876543",
    itemsCount: 3,
    total: 54.75,
    status: "PAYMENT_SENT",
    paymentMethod: "Transfer",
    bankReference: "MOVIL-54321",
    createdAt: "2026-07-22 19:30",
    elapsed: "5 min",
  },
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
    id: "ord-5",
    orderNumber: "#4096",
    tableNumber: 3,
    dinerName: "Pedro Sánchez",
    dinerPhone: "0412-9988776",
    itemsCount: 6,
    total: 120.0,
    status: "PREPARING",
    paymentMethod: "Transfer",
    bankReference: "MOVIL-98765",
    createdAt: "2026-07-22 18:50",
    elapsed: "45 min",
  },
  {
    id: "ord-6",
    orderNumber: "#4097",
    tableNumber: 11,
    dinerName: "Laura Torres",
    dinerPhone: "0424-5566778",
    itemsCount: 2,
    total: 28.0,
    status: "READY",
    paymentMethod: "Transfer",
    bankReference: "REF-007-20240722",
    createdAt: "2026-07-22 18:30",
    elapsed: "1h 05 min",
  },
  {
    id: "ord-7",
    orderNumber: "#4098",
    tableNumber: 7,
    dinerName: "Roberto Díaz",
    dinerPhone: "0412-3344556",
    itemsCount: 3,
    total: 45.5,
    status: "DELIVERED",
    paymentMethod: "Cash",
    bankReference: "REF-008-20240722",
    createdAt: "2026-07-22 17:45",
    elapsed: "1h 50 min",
  },
  {
    id: "ord-8",
    orderNumber: "#4099",
    tableNumber: 19,
    dinerName: "Sofia Rivas",
    dinerPhone: "0416-7788990",
    itemsCount: 5,
    total: 92.0,
    status: "PREPARING",
    paymentMethod: "Transfer",
    bankReference: "MOVIL-11223",
    createdAt: "2026-07-22 18:55",
    elapsed: "40 min",
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
  {
    id: "ord-10",
    orderNumber: "#4101",
    tableNumber: 15,
    dinerName: "Carolina Méndez",
    dinerPhone: "0414-5544332",
    itemsCount: 4,
    total: 67.25,
    status: "DELIVERED",
    paymentMethod: "Transfer",
    bankReference: "REF-010-20240722",
    createdAt: "2026-07-22 16:30",
    elapsed: "3h 05 min",
  },
  {
    id: "ord-11",
    orderNumber: "#4102",
    tableNumber: 9,
    dinerName: "Fernando Ríos",
    dinerPhone: "0412-8877665",
    itemsCount: 1,
    total: 14.0,
    status: "PENDING",
    paymentMethod: "Pending",
    bankReference: "—",
    createdAt: "2026-07-22 19:35",
    elapsed: "0 min",
  },
  {
    id: "ord-12",
    orderNumber: "#4103",
    tableNumber: 1,
    dinerName: "Valentina Paz",
    dinerPhone: "0424-9988776",
    itemsCount: 3,
    total: 52.0,
    status: "PENDING",
    paymentMethod: "Pending",
    bankReference: "—",
    createdAt: "2026-07-22 19:33",
    elapsed: "2 min",
  },
];

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
