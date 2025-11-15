import type { Metadata } from "next";
import "./globals.css";
// import { AuthProvider } from "@/components/auth/AuthProvider"; // Temporariamente desabilitado

export const metadata: Metadata = {
  title: "CalculadoraH2D PRO | BKreativeLab - Precificação para Impressão 3D",
  description: "Calculadora profissional de precificação para impressoras Bambu Lab. Suporte para múltiplas cores, filamentos customizáveis, adereços personalizados e tarifas regionalizadas. Desenvolvido por BKreativeLab.",
  keywords: ["impressão 3D", "precificação", "Bambu Lab", "calculadora", "filamento", "H2D", "BKreativeLab"],
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
        {/* <AuthProvider>{children}</AuthProvider> */}
      </body>
    </html>
  );
}
