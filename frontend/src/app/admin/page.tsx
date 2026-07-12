"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  DollarSign,
  Clock,
  ChefHat,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Phone,
  FileText,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import {
  mockAdminStats,
  mockOrderStatuses,
  mockActivities,
  getPendingPayments,
  addOrder,
  removePendingPayment,
  type PendingPayment,
} from "@/lib/mock-admin";

const activityIconMap = {
  order: "bg-primary",
  payment: "bg-secondary",
  inventory: "bg-muted-foreground",
  error: "bg-destructive",
} as const;

export default function AdminDashboard() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const [payments, setPayments] = useState(getPendingPayments);

  useEffect(() => {
    if (!isAuthenticated) router.push("/admin/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const stats = mockAdminStats;
  const statuses = mockOrderStatuses;
  const activities = mockActivities;

  const handleVerify = (payment: PendingPayment) => {
    addOrder({
      id: `ord-${Date.now()}`,
      orderNumber: payment.orderNumber,
      tableNumber: payment.tableNumber,
      dinerName: payment.dinerName,
      dinerPhone: payment.payerPhone,
      itemsCount: payment.itemsCount,
      total: payment.amount,
      status: "CONFIRMED",
      paymentMethod: payment.paymentMethod,
      bankReference: payment.bankReference,
      createdAt: new Date().toLocaleString("es-ES"),
      elapsed: "0 min",
    });
    removePendingPayment(payment.id);
    setPayments(getPendingPayments());
  };

  const handleReject = (payment: PendingPayment) => {
    addOrder({
      id: `ord-${Date.now()}`,
      orderNumber: payment.orderNumber,
      tableNumber: payment.tableNumber,
      dinerName: payment.dinerName,
      dinerPhone: payment.payerPhone,
      itemsCount: payment.itemsCount,
      total: payment.amount,
      status: "CANCELLED",
      paymentMethod: payment.paymentMethod,
      bankReference: payment.bankReference,
      createdAt: new Date().toLocaleString("es-ES"),
      elapsed: "0 min",
    });
    removePendingPayment(payment.id);
    setPayments(getPendingPayments());
  };

  const today = new Date().toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Resumen
          </h1>
          <p className="text-muted-foreground mt-1">
            {user?.restaurantName ?? "Tu restaurante"} — Así va el día hoy.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            Fecha
          </p>
          <p className="text-lg font-semibold text-foreground">{today}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {/* Card 1 */}
        <div className="bg-card rounded-xl p-4 md:p-5 border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 size-24 bg-primary/10 rounded-full group-hover:scale-110 transition-transform" />
          <div className="flex justify-between items-start mb-2 md:mb-3 relative z-10">
            <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Órdenes de Hoy
            </p>
            <ShoppingBag className="size-4 md:size-5 text-primary" />
          </div>
          <div className="relative z-10">
            <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
              {stats.ordersToday}
            </h3>
            <div className="flex items-center gap-1 mt-0.5 md:mt-1 text-primary">
              <TrendingUp className="size-3 md:size-3.5" />
              <span className="text-[10px] md:text-xs font-medium">{stats.ordersTrend}</span>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-card rounded-xl p-4 md:p-5 border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 size-24 bg-secondary/10 rounded-full group-hover:scale-110 transition-transform" />
          <div className="flex justify-between items-start mb-2 md:mb-3 relative z-10">
            <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Ventas Totales
            </p>
            <DollarSign className="size-4 md:size-5 text-secondary" />
          </div>
          <div className="relative z-10">
            <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
              ${stats.totalSales.toLocaleString()}
            </h3>
            <div className="flex items-center gap-1 mt-0.5 md:mt-1 text-primary">
              <TrendingUp className="size-3 md:size-3.5" />
              <span className="text-[10px] md:text-xs font-medium">{stats.salesTrend}</span>
            </div>
          </div>
        </div>

        {/* Card 3 - Pending Payments (highlighted) */}
        <div className="bg-card rounded-xl p-4 md:p-5 border border-destructive/30 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 size-24 bg-destructive/10 rounded-full group-hover:scale-110 transition-transform" />
          <div className="flex justify-between items-start mb-2 md:mb-3 relative z-10">
            <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Pagos Pendientes
            </p>
            <Clock className="size-4 md:size-5 text-destructive" />
          </div>
          <div className="relative z-10">
            <h3 className="font-heading text-2xl md:text-3xl font-bold text-destructive">
              {stats.pendingPayments}
            </h3>
            <div className="flex items-center gap-1 mt-0.5 md:mt-1 text-destructive">
              <AlertTriangle className="size-3 md:size-3.5" />
              <span className="text-[10px] md:text-xs font-medium">Requiere atención</span>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-card rounded-xl p-4 md:p-5 border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 size-24 bg-accent/10 rounded-full group-hover:scale-110 transition-transform" />
          <div className="flex justify-between items-start mb-2 md:mb-3 relative z-10">
            <p className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Órdenes en Progreso
            </p>
            <ChefHat className="size-4 md:size-5 text-accent" />
          </div>
          <div className="relative z-10">
            <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
              {stats.ordersInProgress}
            </h3>
            <div className="flex items-center gap-1 mt-0.5 md:mt-1 text-muted-foreground">
              <Clock className="size-3 md:size-3.5" />
              <span className="text-[10px] md:text-xs font-medium">
                Tiempo promedio: {stats.avgPrepTime}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Payments Queue (Priority Section) */}
      <div className="bg-destructive/5 rounded-xl border border-destructive/20 shadow-sm p-4 md:p-5">
        <div className="flex items-center gap-2 mb-3 md:mb-4">
          <AlertTriangle className="size-4 md:size-5 text-destructive" />
          <h2 className="font-heading text-base md:text-lg font-semibold text-foreground">
            Pagos Pendientes
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {payments.map((payment: PendingPayment) => (
            <PendingPaymentCard
              key={payment.id}
              payment={payment}
              onVerify={() => handleVerify(payment)}
              onReject={() => handleReject(payment)}
            />
          ))}
          {payments.length === 0 && (
            <div className="col-span-full text-center py-8 text-muted-foreground">
              No hay pagos pendientes
            </div>
          )}
        </div>
      </div>

      {/* Bottom Grid: Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut Chart */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm p-4 md:p-5">
          <div className="flex justify-between items-center mb-3 md:mb-4">
            <h2 className="font-heading text-base md:text-lg font-semibold text-foreground">
              Distribución de Estados
            </h2>
            <button className="p-1 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
              <MoreHorizontal className="size-4 md:size-5" />
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center min-h-[280px] relative">
            {/* CSS Donut */}
            <div
              className="relative size-36 sm:size-48 rounded-full shrink-0"
              style={{
                background: `conic-gradient(
                  ${statuses[0].color} 0% ${statuses[0].percentage}%,
                  ${statuses[1].color} ${statuses[0].percentage}% 100%
                )`,
              }}
            >
              <div className="absolute inset-4 bg-card rounded-full flex flex-col items-center justify-center">
                <span className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
                  {statuses.reduce((s, o) => s + o.count, 0)}
                </span>
                <span className="text-xs text-muted-foreground uppercase font-medium">
                  Total
                </span>
              </div>
            </div>
            {/* Legend - below on mobile, beside on sm+ */}
            <div className="flex flex-row sm:flex-col flex-wrap gap-x-4 gap-y-2 sm:ml-8 mt-4 sm:mt-0 justify-center">
              {statuses.map((s) => (
                <div key={s.status} className="flex items-center gap-2">
                  <div
                    className="size-3 rounded-full shrink-0"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="text-xs sm:text-sm text-foreground whitespace-nowrap">
                    {s.status} ({s.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-xl border border-border shadow-sm p-4 md:p-5 flex flex-col max-h-[400px]">
          <div className="flex justify-between items-center mb-3 md:mb-4">
            <h2 className="font-heading text-base md:text-lg font-semibold text-foreground">
              Actividad Reciente
            </h2>
            <button className="text-xs text-primary hover:underline font-medium">
              Ver Todo
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-3 md:space-y-4 pr-1">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className="mt-1 shrink-0">
                  <div
                    className={`size-2 rounded-full mt-1 ring-4 ${
                      activityIconMap[activity.type]
                    }/20 ${activityIconMap[activity.type]}`}
                  />
                </div>
                <div>
                  <p className="text-sm text-foreground">
                    {activity.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {activity.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function PendingPaymentCard({
  payment,
  onVerify,
  onReject,
}: {
  payment: PendingPayment;
  onVerify: () => void;
  onReject: () => void;
}) {
  return (
    <div className="bg-card rounded-lg p-4 border border-border shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-1">
          <h4 className="font-heading text-base font-semibold text-foreground">
            Orden {payment.orderNumber}
          </h4>
          <span className="bg-destructive/10 text-destructive text-xs font-medium px-2 py-0.5 rounded-full">
            Pendiente
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          Mesa {payment.tableNumber} &bull; {payment.dinerName}
        </p>

        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="size-4 text-primary shrink-0" />
          <span className="font-heading text-xl font-bold text-foreground">
            ${payment.amount.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <Phone className="size-4 text-muted-foreground shrink-0" />
          <span className="text-sm font-medium text-foreground">
            {payment.payerPhone}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <FileText className="size-4 text-muted-foreground shrink-0" />
          <span className="text-sm font-mono text-foreground bg-muted px-2 py-0.5 rounded-md">
            {payment.bankReference}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onVerify}
          className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98]"
        >
          <CheckCircle className="size-4" />
          Verificar
        </button>
        <button
          onClick={onReject}
          className="flex-1 bg-surface-container text-destructive py-2 rounded-lg border border-border text-sm font-medium hover:bg-destructive/10 transition-colors flex items-center justify-center gap-1.5 active:scale-[0.98]"
        >
          <XCircle className="size-4" />
          Rechazar
        </button>
      </div>
    </div>
  );
}
