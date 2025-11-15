import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CalculadoraH2D - Precificação para Impressão 3D",
  description: "Calculadora profissional de precificação para impressoras Bambu Lab",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
