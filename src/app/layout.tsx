import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/shared/navbar"; 
// CartContext එක import කරන්න
import { CartProvider } from "@/context/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reina Slipper Store | Comfort & Style",
  description: "Premium slippers delivered islandwide",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* සම්පූර්ණ ඇප් එකම CartProvider එකෙන් එතීම */}
        <CartProvider>
          <Navbar />
          <main>{children}</main>
          <footer className="bg-white py-12 border-t border-gray-100 text-center">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-xl font-black italic tracking-tighter mb-4">REINA STORE.</h2>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-6">
                Step into comfort and style
              </p>
              <p className="text-gray-500 text-[10px] font-medium uppercase tracking-widest">
                © 2026 Reina Slipper Store. All Rights Reserved.
              </p>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}