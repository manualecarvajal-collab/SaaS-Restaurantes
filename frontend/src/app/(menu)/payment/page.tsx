"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Copy, Check } from "lucide-react";
import { mockBankDetails } from "@/lib/mock-data";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function CopyButton({
  text,
  label,
}: {
  text: string;
  label: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard not available
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 rounded-lg hover:bg-muted transition-colors active:scale-95"
      aria-label={`Copiar ${label}`}
    >
      {copied ? (
        <Check className="size-4 text-primary" />
      ) : (
        <Copy className="size-4 text-muted-foreground" />
      )}
    </button>
  );
}

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const total = searchParams.get("total") || "0.00";
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", reference: "" });
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleConfirm = () => {
    const errs: Record<string, boolean> = {};
    if (!form.name.trim()) errs.name = true;
    if (!form.phone.trim()) errs.phone = true;
    if (!form.reference.trim()) errs.reference = true;
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setShowForm(false);
    router.push(
      `/thank-you?name=${encodeURIComponent(form.name)}&phone=${encodeURIComponent(form.phone)}&ref=${encodeURIComponent(form.reference)}`
    );
  };

  const fields = [
    { label: "Banco", value: mockBankDetails.bank },
    { label: "Titular", value: mockBankDetails.titular },
    { label: "CI/RIF", value: mockBankDetails.ciRif },
    { label: "Teléfono", value: mockBankDetails.phone },
  ];

  return (
    <div className="flex flex-col flex-1">
      <header className="px-4 pt-4 pb-2 flex items-center gap-3 border-b border-border">
        <button
          onClick={() => router.back()}
          className="p-1 -ml-1 rounded-full hover:bg-muted transition-colors"
        >
          <ArrowLeft className="size-5" />
        </button>
        <h1 className="text-lg font-semibold text-foreground">Pago</h1>
      </header>

      <div className="flex-1 px-4 py-6 space-y-8">
        <section>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Total a Pagar
          </p>
          <div className="bg-card rounded-xl border border-border p-4 flex items-center justify-between">
            <span className="text-2xl font-bold text-foreground">
              ${total}
            </span>
            <CopyButton text={`$${total}`} label="total a pagar" />
          </div>
        </section>

        <section>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Datos de Pago Móvil
          </p>
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            {fields.map((field) => (
              <div
                key={field.label}
                className="flex items-center justify-between px-4 py-3"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm text-muted-foreground shrink-0 w-20">
                    {field.label}:
                  </span>
                  <span className="text-sm font-medium text-foreground truncate">
                    {field.value}
                  </span>
                </div>
                <CopyButton text={field.value} label={field.label} />
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="px-4 pb-[max(env(safe-area-inset-bottom),16px)]">
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-primary text-primary-foreground rounded-xl h-14 font-medium uppercase tracking-wider hover:bg-accent transition-colors active:scale-[0.98] shadow-lg"
        >
          Ya realicé el Pago
        </button>
      </div>

      {/* Bottom Sheet — Formulario de Pago */}
      <Sheet open={showForm} onOpenChange={setShowForm}>
        <SheetContent side="bottom" showCloseButton={false}>
          <SheetHeader>
            <SheetTitle>Confirmar Pago</SheetTitle>
            <SheetDescription>
              Ingresa tus datos y la referencia de la transferencia para
              confirmar el pago.
            </SheetDescription>
          </SheetHeader>

          <div className="px-4 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                placeholder="Tu nombre completo"
                value={form.name}
                onChange={(e) => {
                  setForm({ ...form, name: e.target.value });
                  if (errors.name) setErrors({ ...errors, name: false });
                }}
                aria-invalid={errors.name}
              />
              {errors.name && (
                <p className="text-xs text-destructive">El nombre es requerido</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Número de Teléfono</Label>
              <Input
                id="phone"
                placeholder="0412-1234567"
                value={form.phone}
                onChange={(e) => {
                  setForm({ ...form, phone: e.target.value });
                  if (errors.phone) setErrors({ ...errors, phone: false });
                }}
                aria-invalid={errors.phone}
              />
              {errors.phone && (
                <p className="text-xs text-destructive">
                  El teléfono es requerido
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reference">Referencia de Pago</Label>
              <Input
                id="reference"
                placeholder="Número de referencia o comprobante"
                value={form.reference}
                onChange={(e) => {
                  setForm({ ...form, reference: e.target.value });
                  if (errors.reference)
                    setErrors({ ...errors, reference: false });
                }}
                aria-invalid={errors.reference}
              />
              {errors.reference && (
                <p className="text-xs text-destructive">
                  La referencia es requerida
                </p>
              )}
            </div>
          </div>

          <SheetFooter className="px-4 pb-4">
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 bg-surface text-muted-foreground rounded-xl h-12 font-medium border border-border hover:bg-muted transition-colors"
            >
              Volver
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 bg-primary text-primary-foreground rounded-xl h-12 font-medium hover:bg-accent transition-colors"
            >
              Confirmar Pago
            </button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center flex-1">
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  );
}
