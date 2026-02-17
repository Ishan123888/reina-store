import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/shared/navbar";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "../components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Reina Slipper Store | Comfort & Style",
  description: "Premium slippers delivered islandwide",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
    shortcut: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className={`${inter.className} transition-colors duration-300 dark:bg-slate-950`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <footer className="bg-white dark:bg-slate-900 py-12 border-t border-gray-100 dark:border-slate-800 text-center transition-colors duration-300">
              <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-xl font-black italic tracking-tighter mb-4 dark:text-white">
                  REINA STORE.
                </h2>
                <p className="text-gray-400 dark:text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-6">
                  Step into comfort and style
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-[10px] font-medium uppercase tracking-widest">
                  © 2026 Reina Slipper Store. All Rights Reserved.
                </p>
              </div>
            </footer>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}