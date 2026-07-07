"use client";

import { Plus } from "lucide-react";
import type { MenuItem } from "@/lib/mock-data";
import { useCartStore } from "@/stores/cart";

interface MenuItemCardProps {
  item: MenuItem;
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <article className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden flex flex-row h-32 active:scale-[0.98] transition-transform">
      <div className="w-1/3 h-full relative overflow-hidden">
        <img
          className="w-full h-full object-cover"
          src={item.imageUrl}
          alt={item.name}
        />
      </div>
      <div className="w-2/3 p-3 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-sm text-foreground leading-tight mb-1">
            {item.name}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-snug">
            {item.description}
          </p>
        </div>
        <div className="flex justify-between items-end mt-1">
          <span className="text-sm font-semibold text-primary">
            ${item.price.toFixed(2)}
          </span>
          <button
            onClick={() =>
              addItem({
                menu_item_id: item.id,
                name: item.name,
                price: item.price,
              })
            }
            className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-primary-foreground hover:bg-accent transition-colors active:scale-95 shadow-sm"
          >
            <Plus className="size-[20px]" />
          </button>
        </div>
      </div>
    </article>
  );
}
