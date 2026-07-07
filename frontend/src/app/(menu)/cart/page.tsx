"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Minus,
  Trash2,
  ArrowLeft,
  ShoppingBasket,
  Check,
} from "lucide-react";
import { mockMenuItems } from "@/lib/mock-data";
import { useCartStore } from "@/stores/cart";

type FlowStep =
  | "complement-prompt"
  | "complement-select"
  | "drink-prompt"
  | "drink-select"
  | "receipt";

const APP_FEE = 0.1;
const IVA_RATE = 0.16;

export default function CartPage() {
  const router = useRouter();
  const { items, addItem, updateQuantity, removeItem, subtotal } =
    useCartStore();
  const [flowStep, setFlowStep] = useState<FlowStep>("complement-prompt");

  const complementItems = mockMenuItems.filter(
    (i) => i.categoryId === "cat-5"
  );
  const drinkItems = mockMenuItems.filter((i) => i.categoryId === "cat-3");
  const itemSubtotal = subtotal();
  const iva = itemSubtotal * IVA_RATE;
  const total = itemSubtotal + iva + APP_FEE;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 p-8 gap-4">
        <ShoppingBasket className="size-12 text-muted-foreground" />
        <p className="text-muted-foreground text-center">
          Tu bandeja está vacía
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-primary text-primary-foreground rounded-xl px-6 py-3 font-medium hover:bg-accent transition-colors"
        >
          Ver Menú
        </button>
      </div>
    );
  }

  if (flowStep === "receipt") {
    return (
      <div className="flex flex-col flex-1">
        <header className="px-4 pt-4 pb-2 flex items-center gap-3 border-b border-border">
          <button
            onClick={() => router.back()}
            className="p-1 -ml-1 rounded-full hover:bg-muted transition-colors"
          >
            <ArrowLeft className="size-5" />
          </button>
          <h1 className="text-lg font-semibold text-foreground">Tu Pedido</h1>
        </header>

        <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto pb-48">
          {items.map((item) => (
            <div
              key={item.menu_item_id}
              className="flex items-center justify-between"
            >
              <div className="flex-1 min-w-0">
                <span className="text-sm text-foreground">
                  {item.name}{" "}
                  <span className="text-muted-foreground">
                    ×{item.quantity}
                  </span>
                </span>
              </div>
              <span className="text-sm font-medium text-foreground shrink-0 ml-4">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-sm text-foreground">
              Mantenimiendo de la App
            </span>
            <span className="text-sm font-medium text-foreground">
              ${APP_FEE.toFixed(2)}
            </span>
          </div>

          <div className="mt-6 space-y-2 pt-4 border-t-2 border-border">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Subtotal</span>
              <span>${itemSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>IVA (16%)</span>
              <span>${iva.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-foreground pt-2 border-t border-border">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto">
          <div className="bg-card border-t border-border p-4 pb-[max(env(safe-area-inset-bottom),16px)]">
            <button
              onClick={() => router.push(`/payment?total=${total.toFixed(2)}`)}
              className="w-full bg-primary text-primary-foreground rounded-xl h-14 font-medium uppercase tracking-wider hover:bg-accent transition-colors active:scale-[0.98] shadow-lg"
            >
              Confirmar Pedido (${total.toFixed(2)})
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 pb-48">
      <header className="px-4 pt-4 pb-2 flex items-center gap-3 border-b border-border">
        <button
          onClick={() => router.back()}
          className="p-1 -ml-1 rounded-full hover:bg-muted transition-colors"
        >
          <ArrowLeft className="size-5" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">Tu Bandeja</h1>
      </header>

      <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        {items.map((item) => (
          <div
            key={item.menu_item_id}
            className="bg-card rounded-xl border border-border p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1 min-w-0 mr-3">
                <h3 className="text-sm font-semibold text-foreground">
                  {item.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ${item.price.toFixed(2)} c/u
                </p>
              </div>
              <button
                onClick={() => removeItem(item.menu_item_id)}
                className="p-1 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQuantity(item.menu_item_id, item.quantity - 1)
                  }
                  className="w-8 h-8 rounded-full flex items-center justify-center border border-border text-muted-foreground hover:bg-muted transition-colors"
                >
                  {item.quantity === 1 ? (
                    <Trash2 className="size-3.5" />
                  ) : (
                    <Minus className="size-3.5" />
                  )}
                </button>
                <span className="text-sm font-medium text-foreground w-6 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    updateQuantity(item.menu_item_id, item.quantity + 1)
                  }
                  className="w-8 h-8 rounded-full flex items-center justify-center border border-border text-muted-foreground hover:bg-muted transition-colors"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto">
        <div className="bg-card border-t border-border px-4 pt-4 pb-[max(env(safe-area-inset-bottom),16px)] space-y-4">
          {flowStep === "complement-prompt" && (
            <div className="space-y-3">
              <p className="text-center text-sm font-medium text-foreground">
                ¿Agregar complemento?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setFlowStep("complement-select")}
                  className="flex-1 bg-primary text-primary-foreground rounded-xl h-12 font-medium hover:bg-accent transition-colors active:scale-[0.98]"
                >
                  Sí, quiero
                </button>
                <button
                  onClick={() => setFlowStep("drink-prompt")}
                  className="flex-1 bg-surface text-muted-foreground rounded-xl h-12 font-medium border border-border hover:bg-muted transition-colors active:scale-[0.98]"
                >
                  No, gracias
                </button>
              </div>
            </div>
          )}

          {flowStep === "complement-select" && (
            <div className="space-y-3">
              <p className="text-center text-sm font-medium text-foreground">
                Elige tu complemento
              </p>
              {complementItems.map((item) => {
                const cartItem = items.find(
                  (i) => i.menu_item_id === item.id
                );
                const qty = cartItem?.quantity ?? 0;
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <span className="text-sm text-foreground">
                        {item.name}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (qty <= 1) removeItem(item.id);
                          else updateQuantity(item.id, qty - 1);
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center border border-border text-muted-foreground hover:bg-muted transition-colors"
                      >
                        {qty <= 1 ? (
                          <Trash2 className="size-3.5" />
                        ) : (
                          <Minus className="size-3.5" />
                        )}
                      </button>
                      <span className="text-sm font-medium text-foreground w-5 text-center">
                        {qty}
                      </span>
                      <button
                        onClick={() =>
                          addItem({
                            menu_item_id: item.id,
                            name: item.name,
                            price: item.price,
                          })
                        }
                        className="w-8 h-8 rounded-full flex items-center justify-center border border-border text-muted-foreground hover:bg-muted transition-colors"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
              <button
                onClick={() => setFlowStep("drink-prompt")}
                className="w-full bg-primary text-primary-foreground rounded-xl h-12 font-medium hover:bg-accent transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Check className="size-4" />
                OK
              </button>
            </div>
          )}

          {flowStep === "drink-prompt" && (
            <div className="space-y-3">
              <p className="text-center text-sm font-medium text-foreground">
                ¿Agregar bebida?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setFlowStep("drink-select")}
                  className="flex-1 bg-primary text-primary-foreground rounded-xl h-12 font-medium hover:bg-accent transition-colors active:scale-[0.98]"
                >
                  Sí, quiero
                </button>
                <button
                  onClick={() => setFlowStep("receipt")}
                  className="flex-1 bg-surface text-muted-foreground rounded-xl h-12 font-medium border border-border hover:bg-muted transition-colors active:scale-[0.98]"
                >
                  No, gracias
                </button>
              </div>
            </div>
          )}

          {flowStep === "drink-select" && (
            <div className="space-y-3">
              <p className="text-center text-sm font-medium text-foreground">
                Elige tu bebida
              </p>
              {drinkItems.map((item) => {
                const cartItem = items.find(
                  (i) => i.menu_item_id === item.id
                );
                const qty = cartItem?.quantity ?? 0;
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <span className="text-sm text-foreground">
                        {item.name}
                      </span>
                      <span className="text-xs text-muted-foreground ml-2">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          if (qty <= 1) removeItem(item.id);
                          else updateQuantity(item.id, qty - 1);
                        }}
                        className="w-8 h-8 rounded-full flex items-center justify-center border border-border text-muted-foreground hover:bg-muted transition-colors"
                      >
                        {qty <= 1 ? (
                          <Trash2 className="size-3.5" />
                        ) : (
                          <Minus className="size-3.5" />
                        )}
                      </button>
                      <span className="text-sm font-medium text-foreground w-5 text-center">
                        {qty}
                      </span>
                      <button
                        onClick={() =>
                          addItem({
                            menu_item_id: item.id,
                            name: item.name,
                            price: item.price,
                          })
                        }
                        className="w-8 h-8 rounded-full flex items-center justify-center border border-border text-muted-foreground hover:bg-muted transition-colors"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
              <button
                onClick={() => setFlowStep("receipt")}
                className="w-full bg-primary text-primary-foreground rounded-xl h-12 font-medium hover:bg-accent transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Check className="size-4" />
                OK
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
