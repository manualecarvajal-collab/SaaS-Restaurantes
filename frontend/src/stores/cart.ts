import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  menu_item_id: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

interface CartState {
  items: CartItem[];
  restaurantId: string | null;
  tableId: string | null;
  dinerName: string;
  notes: string;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  updateItemNotes: (menuItemId: string, notes: string) => void;
  setDinerName: (name: string) => void;
  setOrderNotes: (notes: string) => void;
  setRestaurant: (id: string) => void;
  setTable: (id: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,
      tableId: null,
      dinerName: "",
      notes: "",

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.menu_item_id === item.menu_item_id
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.menu_item_id === item.menu_item_id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),

      removeItem: (menuItemId) =>
        set((state) => ({
          items: state.items.filter(
            (i) => i.menu_item_id !== menuItemId
          ),
        })),

      updateQuantity: (menuItemId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter(
                  (i) => i.menu_item_id !== menuItemId
                )
              : state.items.map((i) =>
                  i.menu_item_id === menuItemId
                    ? { ...i, quantity }
                    : i
                ),
        })),

      updateItemNotes: (menuItemId, notes) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.menu_item_id === menuItemId ? { ...i, notes } : i
          ),
        })),

      setDinerName: (name) => set({ dinerName: name }),
      setOrderNotes: (notes) => set({ notes }),
      setRestaurant: (id) => set({ restaurantId: id }),
      setTable: (id) => set({ tableId: id }),
      clearCart: () =>
        set({
          items: [],
          dinerName: "",
          notes: "",
        }),

      totalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "cart-storage" }
  )
);
