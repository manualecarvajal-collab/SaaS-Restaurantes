import type { Metadata } from "next";
import { Karla, Nunito } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "SaaS Restaurantes",
  description: "Sistema de pedidos vía QR para restaurantes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${karla.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col px-4">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
