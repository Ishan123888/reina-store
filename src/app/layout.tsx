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
    icon: [
      { url: "/favicon-circle.png", type: "image/png", sizes: "64x64" },
      { url: "/logo.png", type: "image/png" }, // fallback
    ],
    apple: "/favicon-circle.png",
    shortcut: "/favicon-circle.png",
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
        {/*
          SETUP REQUIRED (run once before starting dev server):
            npm install sharp
            node setup-favicon.mjs
          This creates public/favicon-circle.png from your Imgur logo.
        */}
        <link rel="icon" href="/favicon-circle.png" type="image/png" sizes="64x64" />
        <link rel="apple-touch-icon" href="/favicon-circle.png" />
        <link rel="shortcut icon" href="/favicon-circle.png" />
      </head>

      <body
        className={`${inter.className} transition-colors duration-300 dark:bg-slate-950`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>

            {/* ══ FOOTER ══════════════════════════════════════════ */}
            <footer
              className="relative border-t transition-colors duration-300"
              style={{
                background:
                  "linear-gradient(135deg, #050508 0%, #0d0618 50%, #050508 100%)",
                borderColor: "rgba(249,115,22,0.15)",
              }}
            >
              {/* Subtle grid texture */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: 0.03,
                  backgroundImage:
                    "linear-gradient(rgba(249,115,22,1) 1px,transparent 1px)," +
                    "linear-gradient(90deg,rgba(249,115,22,1) 1px,transparent 1px)",
                  backgroundSize: "40px 40px",
                  pointerEvents: "none",
                }}
              />

              <div
                className="relative z-10 max-w-7xl mx-auto px-6 py-14 text-center"
              >
                {/* ── Circular logo (same image used for tab favicon) ── */}
                <div
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    overflow: "hidden",
                    margin: "0 auto 16px",
                    border: "2px solid rgba(249,115,22,0.35)",
                    boxShadow:
                      "0 0 0 4px rgba(249,115,22,0.08), 0 0 24px rgba(249,115,22,0.22)",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/favicon-circle.png"
                    alt="Reina Store"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>

                {/* Brand name */}
                <h2
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 900,
                    fontStyle: "italic",
                    letterSpacing: "-0.05em",
                    color: "#fff",
                    marginBottom: 8,
                  }}
                >
                  REINA STORE.
                </h2>

                {/* Tagline */}
                <p
                  style={{
                    color: "rgba(249,115,22,0.6)",
                    fontSize: 10,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.3em",
                    marginBottom: 24,
                  }}
                >
                  Step into comfort and style
                </p>

                {/* Divider */}
                <div
                  style={{
                    width: 60,
                    height: 1,
                    background:
                      "linear-gradient(90deg, transparent, rgba(249,115,22,0.4), transparent)",
                    margin: "0 auto 20px",
                  }}
                />

                {/* Copyright */}
                <p
                  style={{
                    color: "#475569",
                    fontSize: 10,
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.2em",
                  }}
                >
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