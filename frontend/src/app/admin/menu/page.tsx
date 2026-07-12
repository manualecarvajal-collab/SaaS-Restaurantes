"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Upload, Pencil, Trash2, Loader2, ImageOff, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAuthStore } from "@/stores/auth";
import { api } from "@/lib/api";
import { MenuItemForm } from "@/components/admin/menu-item-form";
import { MenuImportModal } from "@/components/admin/menu-import-modal";

interface Category {
  id: string;
  name: string;
}

interface MenuItemData {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string;
  image_url: string | null;
  image_url_2: string | null;
  is_available: boolean;
}

export default function AdminMenuPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);

  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItemData | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [error, setError] = useState("");

  const restaurantId = user?.restaurantId;

  const fetchData = useCallback(async () => {
    if (!restaurantId) return;
    setLoading(true);
    setError("");
    try {
      const [cats, menuItems] = await Promise.all([
        api.get<Category[]>(`/menu/categories/restaurant/${restaurantId}`),
        api.get<MenuItemData[]>(`/menu/items/restaurant/${restaurantId}`),
      ]);
      setCategories(cats);
      setItems(menuItems);
      if (!activeCategory && cats.length > 0) {
        setActiveCategory(cats[0].id);
      }
    } catch {
      setError("Error al cargar el menú");
    } finally {
      setLoading(false);
    }
  }, [restaurantId, activeCategory]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin/login");
      return;
    }
    fetchData();
  }, [isAuthenticated, router, fetchData]);

  const handleEdit = (item: MenuItemData) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminar este plato?")) return;
    try {
      await api.delete(`/menu/items/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      setError("Error al eliminar");
    }
  };

  const handleToggleAvailable = async (item: MenuItemData) => {
    try {
      await api.patch(`/menu/items/${item.id}`, { is_available: !item.is_available });
      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, is_available: !i.is_available } : i))
      );
    } catch {
      setError("Error al actualizar");
    }
  };

  const handleFormSaved = () => {
    fetchData();
  };

  const filteredItems = activeCategory
    ? items.filter((i) => i.category_id === activeCategory)
    : items;

  if (!isAuthenticated) return null;

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              Menú
            </h1>
            <p className="text-muted-foreground mt-1">
              {user?.restaurantName ?? "Tu restaurante"} — Gestiona los platos de tu carta
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setImportOpen(true)} className="gap-2">
              <Upload className="size-4" />
              Subir Base de datos
            </Button>
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="size-4" />
              Nuevo
            </Button>
          </div>
        </div>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm rounded-lg p-3">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-8 animate-spin text-muted-foreground" />
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <UtensilsCrossed className="size-12 text-muted-foreground" />
            <p className="text-muted-foreground">
              No hay categorías. Agrega categorías desde la base de datos.
            </p>
          </div>
        ) : (
          <>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface-container-low text-muted-foreground hover:bg-surface-container-high"
                  }`}
                >
                  {cat.name}
                  <span className="ml-1.5 text-xs opacity-70">
                    ({items.filter((i) => i.category_id === cat.id).length})
                  </span>
                </button>
              ))}
            </div>

            {filteredItems.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <UtensilsCrossed className="size-10 text-muted-foreground" />
                <p className="text-muted-foreground">No hay platos en esta categoría</p>
                <Button variant="outline" size="sm" onClick={handleAdd}>
                  <Plus className="size-4 mr-1" />
                  Agregar
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-card rounded-xl border border-border shadow-sm overflow-hidden"
                  >
                    <div className="flex gap-3 p-3">
                      <div className="size-20 shrink-0 rounded-lg bg-surface-container-high overflow-hidden flex items-center justify-center">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="size-full object-cover"
                          />
                        ) : (
                          <ImageOff className="size-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-medium text-foreground text-sm leading-tight">
                              {item.name}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                              {item.description || "Sin descripción"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-foreground text-sm">
                            ${item.price.toFixed(2)}
                          </span>
                          <Badge variant={item.is_available ? "default" : "secondary"} className="text-[10px]">
                            {item.is_available ? "Disponible" : "Agotado"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between px-3 py-2 bg-surface-container-lowest border-t border-border">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={item.is_available}
                          onCheckedChange={() => handleToggleAvailable(item)}
                          className="scale-75"
                        />
                        <span className="text-[10px] text-muted-foreground">
                          Disponible
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1.5 rounded-md hover:bg-surface-container-high text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Pencil className="size-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <MenuItemForm
        open={formOpen}
        onOpenChange={setFormOpen}
        item={editingItem}
        restaurantId={restaurantId || ""}
        onSaved={handleFormSaved}
      />

      <MenuImportModal
        open={importOpen}
        onOpenChange={setImportOpen}
        restaurantId={restaurantId || ""}
        onImported={handleFormSaved}
      />
    </>
  );
}
