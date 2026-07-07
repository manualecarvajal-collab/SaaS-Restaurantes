"use client";

import type { MenuCategory } from "@/lib/mock-data";

interface CategoryTabsProps {
  categories: MenuCategory[];
  activeCategory: string;
  onSelect: (id: string) => void;
}

export function CategoryTabs({
  categories,
  activeCategory,
  onSelect,
}: CategoryTabsProps) {
  return (
    <nav className="sticky top-[60px] z-40 bg-background/95 backdrop-blur-sm py-2 px-margin-mobile flex gap-2 overflow-x-auto snap-x snap-mandatory">
      {categories.map((cat) => {
        const isActive = cat.id === activeCategory;
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={
              "snap-start shrink-0 px-4 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap " +
              (isActive
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-surface text-muted-foreground border-border hover:bg-surface-container-low")
            }
          >
            {cat.name}
          </button>
        );
      })}
    </nav>
  );
}
