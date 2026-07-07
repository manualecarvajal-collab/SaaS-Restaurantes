export default function ThankYouPage() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-8 gap-6 text-center">
      <svg
        width="160"
        height="160"
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="80" cy="80" r="80" fill="#7C3AED" fillOpacity="0.08" />
        <circle cx="80" cy="80" r="56" fill="#7C3AED" fillOpacity="0.12" />
        <circle cx="80" cy="80" r="40" className="fill-primary" />
        <path
          d="M68 82L76 90L92 72"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="44" cy="44" r="4" fill="#7C3AED" fillOpacity="0.3" />
        <circle cx="124" cy="36" r="3" fill="#7C3AED" fillOpacity="0.2" />
        <circle cx="36" cy="112" r="3" fill="#7C3AED" fillOpacity="0.2" />
        <circle cx="128" cy="116" r="5" fill="#7C3AED" fillOpacity="0.15" />
        <circle cx="56" cy="28" r="2" fill="#7C3AED" fillOpacity="0.25" />
        <circle cx="110" cy="54" r="2" fill="#7C3AED" fillOpacity="0.2" />
        <circle cx="28" cy="74" r="2.5" fill="#7C3AED" fillOpacity="0.15" />
        <circle cx="134" cy="88" r="2" fill="#7C3AED" fillOpacity="0.25" />
      </svg>

      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground mb-3">
          Muchas Gracias por su Compra
        </h1>
        <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
          Por favor, espere mientras el anfitrión verifica el pago.
        </p>
      </div>
    </div>
  );
}
