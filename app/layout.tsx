import type { Metadata } from "next";
import "./globals.css";
import AutoMigration from "@/components/AutoMigration";
import { Toaster } from 'react-hot-toast';
import GoogleAnalytics from '@/components/GoogleAnalytics';

export const metadata: Metadata = {
  title: "Precifica3D PRO - Calculadora Profissional para Impressão 3D",
  description: "A única plataforma completa de precificação para impressão 3D no Brasil. Calcule custos precisos, gere PDFs profissionais e gerencie seus clientes.",
  keywords: ["impressão 3D", "precificação", "Bambu Lab", "calculadora", "filamento", "Precifica3D", "P3D", "orçamento 3D"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        <GoogleAnalytics />
        <AutoMigration />
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#fff',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '14px',
              fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
