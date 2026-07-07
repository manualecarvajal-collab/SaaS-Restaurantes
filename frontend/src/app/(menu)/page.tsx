"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { Search, UtensilsCrossed } from "lucide-react";
import { mockMenuItems, mockTable, mockRestaurant } from "@/lib/mock-data";
import { MenuItemCard } from "@/components/client/menu-item-card";
import { CartSheet } from "@/components/client/cart-sheet";
import { QRScanner } from "@/components/client/qr-scanner";
import { useCartStore } from "@/stores/cart";

function MenuContent() {
  const searchParams = useSearchParams();
  const tableParam = searchParams.get("table");
  const hasTableContext = !!tableParam;
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const setTable = useCartStore((s) => s.setTable);
  const setRestaurant = useCartStore((s) => s.setRestaurant);

  const handleScan = (tableId: string) => {
    setTable(tableId);
    setRestaurant(mockRestaurant.id);
    router.push(`/?table=${tableId}`);
  };

  const items = mockMenuItems
    .filter((item) => item.categoryId === "cat-2")
    .filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (!hasTableContext) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-8 gap-6 text-center">
        <div className="w-20 h-20 rounded-full bg-primary-container flex items-center justify-center">
          <UtensilsCrossed className="size-10 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
            {mockRestaurant.name}
          </h1>
          <p className="text-sm text-muted-foreground max-w-xs">
            Escanea el código QR de tu mesa para ver el menú y hacer tu pedido.
          </p>
        </div>

        <div className="w-full max-w-xs">
          <QRScanner onScan={handleScan} />
        </div>
      </div>
    );
  }

  const tableNumber = tableParam || "12";

  return (
    <>
      <section className="px-4 pt-6 pb-2">
        <div className="flex items-center gap-1 mt-1">
          <UtensilsCrossed className="size-7 text-foreground" />
          <span className="text-[28px] font-heading font-bold text-foreground uppercase tracking-wider">
            Table #{tableNumber}
          </span>
        </div>
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline size-5" />
          <input
            type="text"
            placeholder="Buscar plato..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface border border-border rounded-xl py-2 pl-10 pr-4 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline"
          />
        </div>
      </section>

      <main className="flex-1 px-4 py-4 pb-32">
        <div className="grid grid-cols-1 gap-3">
          {items.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
          {items.length === 0 && (
            <p className="text-center text-muted-foreground text-sm py-8">
              No se encontraron platos
            </p>
          )}
        </div>
      </main>

      <CartSheet />
    </>
  );
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center flex-1">
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      }
    >
      <MenuContent />
    </Suspense>
  );
}
