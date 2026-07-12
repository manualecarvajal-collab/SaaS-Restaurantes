"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Download, Eye } from "lucide-react";
import { api } from "@/lib/api";

interface ImportResult {
  imported: number;
  errors: { row: number; error: string }[];
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurantId: string;
  onImported: () => void;
}

type Step = "instructions" | "preview" | "result";

const TEMPLATE_CSV = `nombre,precio,descripcion,categoria,foto,foto_2,disponible
Lomo Saltado,18.99,Lomo de res salteado con cebolla y tomate,Platos Fuertes,https://example.com/lomo.jpg,,true
Ceviche Clasico,9.99,Ceviche de pescado fresco con limón y cebolla,Entradas,,,true`;

export function MenuImportModal({ open, onOpenChange, restaurantId, onImported }: Props) {
  const [step, setStep] = useState<Step>("instructions");
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setStep("instructions");
    setFile(null);
    setImporting(false);
    setResult(null);
    setError("");
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) reset();
    onOpenChange(open);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (ext !== "csv" && ext !== "xlsx") {
      setError("Solo archivos .csv y .xlsx son soportados");
      return;
    }
    setFile(f);
    setError("");
    setStep("preview");
  };

  const downloadTemplate = () => {
    const blob = new Blob([TEMPLATE_CSV], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plantilla_menu.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    if (!file) return;
    setImporting(true);
    setError("");

    try {
      const data = await api.upload<ImportResult>(
        `/menu/items/import?restaurant_id=${restaurantId}`,
        file
      );
      setResult(data);
      setStep("result");
      if (data.imported > 0) onImported();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al importar");
    } finally {
      setImporting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importar Menú</DialogTitle>
          <DialogDescription>
            Carga un archivo .csv o .xlsx con los platos de tu menú
          </DialogDescription>
        </DialogHeader>

        {step === "instructions" && (
          <div className="space-y-6">
            <div className="bg-surface-container-low rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Eye className="size-4" />
                Columnas esperadas
              </h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <p><span className="font-medium text-foreground">nombre</span> — Nombre del plato (obligatorio)</p>
                <p><span className="font-medium text-foreground">precio</span> — Precio en USD (obligatorio)</p>
                <p><span className="font-medium text-foreground">descripcion</span> — Máx 100 caracteres</p>
                <p><span className="font-medium text-foreground">categoria</span> — Nombre de la categoría (debe existir en el sistema)</p>
                <p><span className="font-medium text-foreground">foto</span> — URL de la foto principal</p>
                <p><span className="font-medium text-foreground">foto_2</span> — URL de la segunda foto</p>
                <p><span className="font-medium text-foreground">disponible</span> — true/false</p>
              </div>
            </div>

            <div className="bg-primary/5 rounded-lg p-4 space-y-2">
              <p className="text-xs text-muted-foreground">
                <strong>Paso 1:</strong> Descarga la plantilla de ejemplo para ver el formato esperado.
              </p>
              <p className="text-xs text-muted-foreground">
                <strong>Paso 2:</strong> Completa tus platos en el archivo.
              </p>
              <p className="text-xs text-muted-foreground">
                <strong>Paso 3:</strong> Selecciona el archivo y confirma la importación.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <Button variant="outline" onClick={downloadTemplate} className="gap-2 w-full sm:w-auto justify-center">
                <Download className="size-4" />
                Descargar Plantilla
              </Button>
              <Button onClick={() => fileRef.current?.click()} className="gap-2 w-full sm:w-auto justify-center">
                <Upload className="size-4" />
                Seleccionar Archivo
              </Button>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,.xlsx"
                className="hidden"
                onChange={handleFileSelect}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )}

        {step === "preview" && file && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-lg">
              <FileSpreadsheet className="size-6 text-primary" />
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>

            <div className="bg-primary/5 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">
                Al confirmar, los platos se agregarán a tu menú. Las filas con errores se omitirán.
              </p>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setStep("instructions")} disabled={importing}>
                Volver
              </Button>
              <Button onClick={handleImport} disabled={importing}>
                {importing && <Loader2 className="size-4 animate-spin mr-2" />}
                Importar Platos
              </Button>
            </div>
          </div>
        )}

        {step === "result" && result && (
          <div className="space-y-4">
            {result.imported > 0 ? (
              <div className="flex flex-col items-center gap-2 py-4 text-center">
                <CheckCircle2 className="size-10 text-green-500" />
                <p className="text-lg font-semibold text-foreground">
                  {result.imported} plato{result.imported !== 1 ? "s" : ""} importado{result.imported !== 1 ? "s" : ""} exitosamente
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-4 text-center">
                <AlertCircle className="size-10 text-destructive" />
                <p className="text-lg font-semibold text-foreground">No se importaron platos</p>
              </div>
            )}

            {result.errors.length > 0 && (
              <div className="bg-destructive/5 rounded-lg p-3 space-y-1">
                <p className="text-xs font-medium text-destructive">
                  {result.errors.length} error{result.errors.length !== 1 ? "es" : ""}:
                </p>
                {result.errors.slice(0, 5).map((err, i) => (
                  <p key={i} className="text-xs text-muted-foreground">
                    Fila {err.row}: {err.error}
                  </p>
                ))}
                {result.errors.length > 5 && (
                  <p className="text-xs text-muted-foreground">
                    ...y {result.errors.length - 5} más
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={() => handleOpenChange(false)}>
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
