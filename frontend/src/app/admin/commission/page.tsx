"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DollarSign, Receipt, TrendingUp, CalendarDays, Minus } from "lucide-react";
import { useAuthStore } from "@/stores/auth";
import { getOrders } from "@/lib/mock-admin";

const COMMISSION_PER_ORDER = 0.10;

export default function CommissionPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const [orders] = useState(getOrders);

  useEffect(() => {
    if (!isAuthenticated) router.push("/admin/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const now = new Date();
  const monthName = now.toLocaleDateString("es-ES", { month: "long", year: "numeric" });

  const confirmedOrders = orders.filter((o) => o.status === "CONFIRMED");
  const orderCount = confirmedOrders.length;
  const totalAmount = confirmedOrders.reduce((sum, o) => sum + o.total, 0);
  const commission = orderCount * COMMISSION_PER_ORDER;

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Comisión
          </h1>
          <p className="text-muted-foreground mt-1">
            {user?.restaurantName ?? "Tu restaurante"} — Resumen del mes
          </p>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <CalendarDays className="size-4" />
          <span className="text-sm font-medium capitalize">{monthName}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-4 md:p-5 border border-border shadow-sm relative overflow-hidden">
          <div className="absolute -right-6 -top-6 size-24 bg-primary/10 rounded-full" />
          <div className="flex justify-between items-start mb-2 relative z-10">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Órdenes del Mes
            </p>
            <Receipt className="size-5 text-primary" />
          </div>
          <div className="relative z-10">
            <h3 className="font-heading text-3xl font-bold text-foreground">
              {orderCount}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              órdenes confirmadas
            </p>
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 md:p-5 border border-destructive/30 shadow-sm relative overflow-hidden">
          <div className="absolute -right-6 -top-6 size-24 bg-destructive/10 rounded-full" />
          <div className="flex justify-between items-start mb-2 relative z-10">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Comisión
            </p>
            <Minus className="size-5 text-destructive" />
          </div>
          <div className="relative z-10">
            <h3 className="font-heading text-3xl font-bold text-destructive">
              -${commission.toFixed(2)}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              ${COMMISSION_PER_ORDER.toFixed(2)} × {orderCount} órdenes
            </p>
          </div>
        </div>

        <div className="bg-card rounded-xl p-4 md:p-5 border border-border shadow-sm relative overflow-hidden">
          <div className="absolute -right-6 -top-6 size-24 bg-secondary/10 rounded-full" />
          <div className="flex justify-between items-start mb-2 relative z-10">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
              Neto a Pagar
            </p>
            <DollarSign className="size-5 text-secondary" />
          </div>
          <div className="relative z-10">
            <h3 className="font-heading text-3xl font-bold text-foreground">
              ${commission.toFixed(2)}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              ${COMMISSION_PER_ORDER.toFixed(2)} × {orderCount} órdenes
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-4 md:px-5 py-4 border-b border-border">
          <h2 className="font-heading text-base md:text-lg font-semibold text-foreground">
            Órdenes Confirmadas
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-border">
                <th className="px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">Orden</th>
                <th className="px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">Mesa</th>
                <th className="px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">Comensal</th>
                <th className="px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">Total</th>
                <th className="px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">Comisión</th>
                <th className="px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider font-medium">Neto</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-border">
              {orderCount === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    No hay órdenes confirmadas este mes
                  </td>
                </tr>
              ) : (
                confirmedOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{order.orderNumber}</td>
                    <td className="px-4 py-3 text-muted-foreground">{order.tableNumber}</td>
                    <td className="px-4 py-3 text-foreground">{order.dinerName}</td>
                    <td className="px-4 py-3 font-medium text-foreground">${order.total.toFixed(2)}</td>
                    <td className="px-4 py-3 text-destructive">-$0.10</td>
                    <td className="px-4 py-3 font-medium text-foreground">${(order.total - COMMISSION_PER_ORDER).toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
