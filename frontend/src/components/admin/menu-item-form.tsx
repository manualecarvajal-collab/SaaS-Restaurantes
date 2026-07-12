"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, ImagePlus } from "lucide-react";
import { api } from "@/lib/api";

interface Category {
  id: string;
  name: string;
}

interface MenuItemFormData {
  name: string;
  description: string;
  price: string;
  category_id: string;
  image_url: string;
  image_url_2: string;
  is_available: boolean;
}

interface MenuItemResponse {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string;
  image_url: string | null;
  image_url_2: string | null;
  is_available: boolean;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: MenuItemResponse | null;
  restaurantId: string;
  onSaved: () => void;
}

export function MenuItemForm({ open, onOpenChange, item, restaurantId, onSaved }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<MenuItemFormData>({
    name: "",
    description: "",
    price: "",
    category_id: "",
    image_url: "",
    image_url_2: "",
    is_available: true,
  });

  useEffect(() => {
    if (open) {
      setError("");
      if (item) {
        setForm({
          name: item.name,
          description: item.description || "",
          price: item.price.toString(),
          category_id: item.category_id,
          image_url: item.image_url || "",
          image_url_2: item.image_url_2 || "",
          is_available: item.is_available,
        });
      } else {
        setForm({
          name: "",
          description: "",
          price: "",
          category_id: "",
          image_url: "",
          image_url_2: "",
          is_available: true,
        });
      }
      loadCategories();
    }
  }, [open, item]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await api.get<Category[]>(`/menu/categories/restaurant/${restaurantId}`);
      setCategories(data);
      if (data.length > 0 && !item) {
        setForm((prev) => ({ ...prev, category_id: data[0].id }));
      }
    } catch {
      setError("Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  };

  const validate = (): string | null => {
    if (!form.name.trim()) return "El nombre es obligatorio";
    if (form.description.length > 100) return "La descripción no puede exceder 100 caracteres";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) return "Ingresa un precio válido";
    if (!form.category_id) return "Selecciona una categoría";
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError("");

    try {
      const body = {
        restaurant_id: restaurantId,
        category_id: form.category_id,
        name: form.name.trim(),
        description: form.description.trim() || null,
        price: Number(form.price),
        image_url: form.image_url.trim() || null,
        image_url_2: form.image_url_2.trim() || null,
        is_available: form.is_available,
      };

      if (item) {
        await api.patch(`/menu/items/${item.id}`, body);
      } else {
        await api.post("/menu/items", body);
      }
      onSaved();
      onOpenChange(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? "Editar Plato" : "Agregar Plato"}</DialogTitle>
          <DialogDescription>
            {item ? "Modifica los datos del plato" : "Completa los datos del nuevo plato"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ej: Lomo Saltado"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Precio *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Descripción <span className="text-muted-foreground">({form.description.length}/100)</span>
            </Label>
            <textarea
              id="description"
              value={form.description}
              onChange={(e) => {
                if (e.target.value.length <= 100) {
                  setForm({ ...form, description: e.target.value });
                }
              }}
              placeholder="Breve descripción del plato (máx 100 caracteres)"
              className="flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoría *</Label>
            <Select
              value={form.category_id}
              onValueChange={(v) => setForm({ ...form, category_id: v || "" })}
            >
              <SelectTrigger>
                <SelectValue placeholder={loading ? "Cargando..." : "Seleccionar categoría"} />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Fotos (máx 2)</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ImagePlus className="size-3.5" />
                  Foto 1
                </div>
                <Input
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                  placeholder="URL de la foto"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ImagePlus className="size-3.5" />
                  Foto 2
                </div>
                <Input
                  value={form.image_url_2}
                  onChange={(e) => setForm({ ...form, image_url_2: e.target.value })}
                  placeholder="URL de la foto 2"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="available">Disponible</Label>
            <Switch
              id="available"
              checked={form.is_available}
              onCheckedChange={(v) => setForm({ ...form, is_available: v })}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={saving || loading}>
              {saving && <Loader2 className="size-4 animate-spin mr-2" />}
              {item ? "Guardar Cambios" : "Agregar Plato"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
