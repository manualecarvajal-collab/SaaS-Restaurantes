"use client";

import { useState, useMemo } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Clock,
} from "lucide-react";
import {
  getOrders,
  orderStatusLabels,
  orderStatusColors,
  type OrderStatusType,
  type AdminOrder,
} from "@/lib/mock-admin";

const statusFilters: Array<{ label: string; value: OrderStatusType | "ALL" }> = [
  { label: "Todas", value: "ALL" },
  { label: "Confirmadas", value: "CONFIRMED" },
  { label: "Canceladas", value: "CANCELLED" },
];

const PAGE_SIZE = 8;

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState<OrderStatusType | "ALL">(
    "ALL"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [sortField, setSortField] = useState<keyof AdminOrder>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const orders = getOrders();

  const filtered = useMemo(() => {
    let result =
      activeFilter === "ALL"
        ? [...orders]
        : orders.filter((o) => o.status === activeFilter);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.dinerName.toLowerCase().includes(q) ||
          o.bankReference.toLowerCase().includes(q) ||
          String(o.tableNumber).includes(q)
      );
    }

    result.sort((a, b) => {
      const aVal = String(a[sortField] ?? "");
      const bVal = String(b[sortField] ?? "");
      const cmp = aVal.localeCompare(bVal);
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [activeFilter, searchQuery, sortField, sortDir, orders]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const toggleSort = (field: keyof AdminOrder) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Órdenes
          </h1>
          <p className="text-muted-foreground mt-1">
            Registro completo de todas las órdenes de la plataforma.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
            Total Órdenes
          </p>
          <p className="text-lg font-semibold text-foreground">
            {getOrders().length}
          </p>
        </div>
      </div>

      {/* Search + Filter Tabs */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por orden, comensal, mesa, referencia..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(0);
            }}
            className="w-full bg-surface border border-border rounded-lg py-2 pl-9 pr-4 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((f) => {
          const isActive = activeFilter === f.value;
          return (
            <button
              key={f.value}
              onClick={() => {
                setActiveFilter(f.value);
                setPage(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface-container text-muted-foreground hover:bg-surface-container-high"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-border">
                <Th onClick={() => toggleSort("orderNumber")}>
                  Orden <ArrowUpDown className="size-3" />
                </Th>
                <Th onClick={() => toggleSort("tableNumber")}>
                  Mesa <ArrowUpDown className="size-3" />
                </Th>
                <Th onClick={() => toggleSort("dinerName")}>
                  Comensal <ArrowUpDown className="size-3" />
                </Th>
                <Th onClick={() => toggleSort("itemsCount")}>
                  Items <ArrowUpDown className="size-3" />
                </Th>
                <Th onClick={() => toggleSort("total")}>
                  Total <ArrowUpDown className="size-3" />
                </Th>
                <Th onClick={() => toggleSort("status")}>
                  Estado <ArrowUpDown className="size-3" />
                </Th>
                <Th>Referencia</Th>
                <Th onClick={() => toggleSort("elapsed")}>
                  Tiempo <ArrowUpDown className="size-3" />
                </Th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-border">
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No se encontraron órdenes
                  </td>
                </tr>
              ) : (
                paginated.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-surface-container-lowest transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {order.orderNumber}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {order.tableNumber}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="text-foreground">{order.dinerName}</div>
                        <div className="text-xs text-muted-foreground">
                          {order.dinerPhone}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {order.itemsCount}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                          orderStatusColors[order.status]
                        }`}
                      >
                        {orderStatusLabels[order.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {order.bankReference}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      <div>{order.elapsed}</div>
                      <div className="text-xs">{order.createdAt}</div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Desktop Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-surface-container-low">
          <span className="text-sm text-muted-foreground">
            Mostrando {page * PAGE_SIZE + 1}–
            {Math.min((page + 1) * PAGE_SIZE, filtered.length)} de{" "}
            {filtered.length}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="p-1.5 rounded-lg border border-border text-muted-foreground hover:bg-surface-container-high disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="p-1.5 rounded-lg border border-border text-muted-foreground hover:bg-surface-container-high disabled:opacity-40 transition-colors"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="block md:hidden space-y-3">
        {paginated.length === 0 ? (
          <div className="bg-card rounded-xl border border-border shadow-sm p-8 text-center text-muted-foreground">
            No se encontraron órdenes
          </div>
        ) : (
          paginated.map((order) => (
            <div
              key={order.id}
              className="bg-card rounded-xl border border-border shadow-sm p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-foreground">
                    {order.orderNumber}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Mesa {order.tableNumber}
                  </span>
                </div>
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${
                    orderStatusColors[order.status]
                  }`}
                >
                  {orderStatusLabels[order.status]}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{order.dinerName}</p>
                  <p className="text-xs text-muted-foreground">{order.dinerPhone}</p>
                </div>
                <span className="font-heading text-lg font-bold text-foreground">
                  ${order.total.toFixed(2)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-mono bg-muted px-1.5 py-0.5 rounded">
                  {order.bankReference}
                </span>
                <div className="flex items-center gap-1">
                  <Clock className="size-3" />
                  <span>{order.elapsed}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border pt-2">
                <span>{order.itemsCount} items</span>
                <span>{order.createdAt}</span>
              </div>
            </div>
          ))
        )}

        {/* Mobile Pagination */}
        <div className="flex items-center justify-between px-2 py-3">
          <span className="text-xs text-muted-foreground">
            {page * PAGE_SIZE + 1}–
            {Math.min((page + 1) * PAGE_SIZE, filtered.length)} de {filtered.length}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:bg-surface-container-high disabled:opacity-40 transition-colors"
            >
              Anterior
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 rounded-lg border border-border text-sm text-muted-foreground hover:bg-surface-container-high disabled:opacity-40 transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function Th({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <th
      onClick={onClick}
      className={`px-4 py-3 text-xs text-muted-foreground uppercase tracking-wider font-medium ${
        onClick ? "cursor-pointer hover:text-foreground select-none" : ""
      }`}
    >
      <div className="flex items-center gap-1">{children}</div>
    </th>
  );
}
