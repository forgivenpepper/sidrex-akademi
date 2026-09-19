import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sidrex Video Galeri & Ürün Vitrini",
  description: "Modern, yüksek performanslı müşteri video galerisi ve ürün künye platformu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="bg-[#090d16] text-gray-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
