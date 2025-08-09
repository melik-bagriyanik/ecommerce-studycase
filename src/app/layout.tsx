import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import ToastWrapper from "./components/ToastWrapper";
import HeaderWrapper from "./components/HeaderWrapper";
import CartOverlay from "./components/CartOverlay";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MelikShop - Online Alışveriş",
  description: "En kaliteli ürünleri en uygun fiyatlarla bulabileceğiniz online alışveriş platformu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <CartProvider>
          <HeaderWrapper />
          {children}
          <ToastWrapper />
          <CartOverlay />
        </CartProvider>
      </body>
    </html>
  );
}
