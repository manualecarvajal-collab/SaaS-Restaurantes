"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Check, Minus, Plus, ShoppingBasket } from "lucide-react";
import { getItemById, mockCategories } from "@/lib/mock-data";
import { useCartStore } from "@/stores/cart";

export default function MenuItemDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const item = getItemById(params.id);
  const addItem = useCartStore((s) => s.addItem);
  const cartCount = useCartStore((s) =>
    s.items.reduce((total, i) => total + i.quantity, 0)
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!item) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
        <p className="text-muted-foreground text-sm">
          No encontramos ese plato en la carta.
        </p>
        <Link href="/" className="text-primary text-sm font-medium">
          Volver al menú
        </Link>
      </div>
    );
  }

  const category = mockCategories.find((c) => c.id === item.categoryId);

  const handleAdd = () => {
    // addItem increments by one, so top up to the chosen quantity afterwards.
    const already = useCartStore
      .getState()
      .items.find((i) => i.menu_item_id === item.id)?.quantity ?? 0;

    addItem({
      menu_item_id: item.id,
      name: item.name,
      price: item.price,
    });

    if (quantity > 1) {
      useCartStore.getState().updateQuantity(item.id, already + quantity);
    }

    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 px-4 py-3 bg-background/95 backdrop-blur-sm border-b border-border">
        <button
          onClick={() => router.back()}
          aria-label="Volver"
          className="w-9 h-9 rounded-full flex items-center justify-center border border-border text-foreground hover:bg-muted transition-colors"
        >
          <ArrowLeft className="size-4" />
        </button>

        <Link
          href="/cart"
          aria-label="Ver bandeja"
          className="relative w-9 h-9 rounded-full flex items-center justify-center border border-border text-foreground hover:bg-muted transition-colors"
        >
          <ShoppingBasket className="size-4" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </Link>
      </header>

      <div className="w-full aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>

      <main className="flex-1 px-4 py-5 pb-40">
        {category && (
          <span className="inline-block text-[11px] uppercase tracking-wider font-medium text-on-primary-container bg-primary-container rounded-full px-3 py-1 mb-3">
            {category.name}
          </span>
        )}

        <h1 className="font-heading text-2xl font-bold text-foreground leading-tight">
          {item.name}
        </h1>

        <p className="text-2xl font-semibold text-primary mt-2">
          ${item.price.toFixed(2)}
        </p>

        <p className="text-sm text-muted-foreground leading-relaxed mt-4">
          {item.description}
        </p>

        {!item.isAvailable && (
          <p className="text-sm text-destructive mt-4">
            No disponible por ahora.
          </p>
        )}
      </main>

      <div className="fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-lg p-4 bg-gradient-to-t from-background via-background to-transparent pb-[max(env(safe-area-inset-bottom),16px)]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 h-12 px-2 rounded-xl bg-card border border-border">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Quitar una unidad"
              className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-6 text-center font-medium text-foreground">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Agregar una unidad"
              className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
            >
              <Plus className="size-4" />
            </button>
          </div>

          <button
            onClick={handleAdd}
            disabled={!item.isAvailable}
            className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 shadow-lg hover:bg-accent transition-colors active:scale-[0.98] disabled:opacity-60"
          >
            {added ? (
              <>
                <Check className="size-4" />
                Agregado
              </>
            ) : (
              <>Agregar · ${(item.price * quantity).toFixed(2)}</>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
