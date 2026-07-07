"use client";

import { ShoppingBasket, Plus, Minus, Trash2 } from "lucide-react";
import { useCartStore } from "@/stores/cart";
import { useRouter } from "next/navigation";

export function CartSheet() {
  const { items, totalItems, subtotal, updateQuantity, removeItem } =
    useCartStore();
  const router = useRouter();
  const count = totalItems();

  if (count === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full p-4 z-50 bg-gradient-to-t from-background via-background to-transparent pb-[max(env(safe-area-inset-bottom),16px)]">
      <div className="bg-card rounded-xl border border-border shadow-lg mb-3 p-4 space-y-3">
        {items.map((item) => (
          <div
            key={item.menu_item_id}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {item.name}
              </p>
              <p className="text-xs text-muted-foreground">
                ${item.price.toFixed(2)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  updateQuantity(item.menu_item_id, item.quantity - 1)
                }
                className="w-7 h-7 rounded-full flex items-center justify-center border border-border text-muted-foreground hover:bg-muted transition-colors"
              >
                {item.quantity === 1 ? (
                  <Trash2 className="size-3.5" />
                ) : (
                  <Minus className="size-3.5" />
                )}
              </button>
              <span className="text-sm font-medium text-foreground w-5 text-center">
                {item.quantity}
              </span>
              <button
                onClick={() =>
                  updateQuantity(item.menu_item_id, item.quantity + 1)
                }
                className="w-7 h-7 rounded-full flex items-center justify-center border border-border text-muted-foreground hover:bg-muted transition-colors"
              >
                <Plus className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => router.push("/cart")}
        className="w-full bg-primary text-primary-foreground rounded-xl h-14 flex items-center px-4 shadow-lg hover:bg-accent transition-colors active:scale-[0.98] justify-center"
      >
        <div className="flex items-center gap-2">
          <ShoppingBasket className="size-5" />
          <span className="font-medium uppercase tracking-wider">
            ir a bandeja ({count})
          </span>
        </div>
      </button>
    </div>
  );
}
