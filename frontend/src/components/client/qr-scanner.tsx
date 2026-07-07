"use client";

import { QrCode } from "lucide-react";

interface QRScannerProps {
  onScan: (tableId: string) => void;
}

export function QRScanner({ onScan }: QRScannerProps) {
  return (
    <button
      onClick={() => onScan("12")}
      className="w-full bg-primary text-primary-foreground rounded-xl h-14 flex items-center justify-center gap-2 shadow-lg hover:bg-accent transition-colors active:scale-[0.98]"
    >
      <QrCode className="size-5" />
      <span className="font-medium">Escanear QR</span>
    </button>
  );
}
