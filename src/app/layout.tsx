import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sidrex | Ürün & Video Kataloğu",
  description: "Minimalist, modern Sidrex Müşteri Video Galeri & Ürün Künye Platformu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="bg-[#f8fafc] text-[#0b2545] min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
