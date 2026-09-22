import type { Metadata } from "next";
import "./globals.css";
import CookieBanner from "@/components/CookieBanner";

export const metadata: Metadata = {
  title: "Sidrex Akademi | Ürün & Video Kataloğu",
  description: "Minimalist, modern Sidrex Akademi Müşteri Video Galeri & Ürün Künye Platformu.",
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
        <CookieBanner />
      </body>
    </html>
  );
}
