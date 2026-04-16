import type { Metadata } from "next";
import { Mail, Phone, MapPin, Facebook, Instagram, Send } from "lucide-react";
import Navbar from "@/components/shared/navbar";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";
export const metadata: Metadata = {
  title: "Reina Store | Premium Slippers",
  description: "Experience the ultimate blend of comfort and luxury with our premium slipper collection.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const bgImageUrl = "https://i.imgur.com/6VS5Ue8.png";

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans transition-colors duration-300 dark:bg-slate-950">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <CartProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>

            {/* ══ MODERN 3D GLASS FOOTER ══════════════════════════════════════════ */}
            <footer
              style={{
                position: "relative",
                minHeight: "400px",
                backgroundColor: "#020408",
                backgroundImage: `linear-gradient(rgba(2, 4, 8, 0.85), rgba(2, 4, 8, 0.95)), url("${bgImageUrl}")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
                color: "#fff",
                overflow: "hidden",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <style>{`
                .glass-card {
                  background: rgba(255, 255, 255, 0.03);
                  backdrop-filter: blur(20px);
                  -webkit-backdrop-filter: blur(20px);
                  border: 1px solid rgba(255, 255, 255, 0.08);
                  border-radius: 24px;
                  transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .glass-card:hover {
                  transform: translateY(-5px);
                  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
                  border-color: rgba(6, 182, 212, 0.3);
                }
                .social-icon {
                  width: 45px;
                  height: 45px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border-radius: 50%;
                  background: rgba(255, 255, 255, 0.05);
                  border: 1px solid rgba(255, 255, 255, 0.1);
                  transition: 0.3s;
                  color: #fff;
                }
                .social-icon:hover {
                  background: #22d3ee;
                  color: #000;
                  transform: scale(1.1) rotate(8deg);
                  box-shadow: 0 0 20px rgba(34, 211, 238, 0.4);
                }
                .footer-link {
                  color: rgba(255, 255, 255, 0.6);
                  text-decoration: none;
                  font-size: 14px;
                  transition: 0.2s;
                  display: block;
                  margin-bottom: 8px;
                }
                .footer-link:hover {
                  color: #22d3ee;
                  padding-left: 5px;
                }
              `}</style>

              {/* Grid Lines Overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
                  backgroundSize: "50px 50px",
                  pointerEvents: "none",
                }}
              />

              <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "40px",
                  }}
                >
                  {/* Brand Section */}
                  <div className="glass-card" style={{ padding: "30px" }}>
                    <h2
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: "1.8rem",
                        fontWeight: 800,
                        marginBottom: "15px",
                        letterSpacing: "-1px",
                      }}
                    >
                      REINA <span style={{ color: "#22d3ee" }}>STORE.</span>
                    </h2>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        lineHeight: "1.6",
                        fontSize: "14px",
                        marginBottom: "25px",
                      }}
                    >
                      Experience the ultimate blend of comfort and luxury with
                      our premium slipper collection. Crafted for your
                      relaxation.
                    </p>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <a href="#" className="social-icon">
                        <Facebook size={20} />
                      </a>
                      <a href="#" className="social-icon">
                        <Instagram size={20} />
                      </a>
                      <a
                        href="https://wa.me/94771234567"
                        className="social-icon"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L22 2l-2.5 5.5Z" />
                        </svg>
                      </a>
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div style={{ padding: "10px" }}>
                    <h4
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        marginBottom: "20px",
                        color: "#22d3ee",
                      }}
                    >
                      Quick Links
                    </h4>
                    <a href="/" className="footer-link">
                      Home Collection
                    </a>
                    <a href="/collections" className="footer-link">
                      New Arrivals
                    </a>
                    <a href="/contact" className="footer-link">
                      Contact Support
                    </a>
                    <a href="/track-order" className="footer-link">
                      Track My Order
                    </a>
                  </div>

                  {/* Contact Info */}
                  <div style={{ padding: "10px" }}>
                    <h4
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        marginBottom: "20px",
                        color: "#22d3ee",
                      }}
                    >
                      Find Us
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "15px",
                        color: "rgba(255,255,255,0.7)",
                      }}
                    >
                      <MapPin size={18} style={{ color: "#22d3ee" }} />
                      <span style={{ fontSize: "14px" }}>
                        123 Reina Street, Colombo 03
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "15px",
                        color: "rgba(255,255,255,0.7)",
                      }}
                    >
                      <Phone size={18} style={{ color: "#22d3ee" }} />
                      <span style={{ fontSize: "14px" }}>+94 77 123 4567</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        color: "rgba(255,255,255,0.7)",
                      }}
                    >
                      <Mail size={18} style={{ color: "#22d3ee" }} />
                      <span style={{ fontSize: "14px" }}>
                        hello@reinastore.lk
                      </span>
                    </div>
                  </div>

                  {/* Newsletter / CTA */}
                  <div
                    className="glass-card"
                    style={{
                      padding: "30px",
                      border: "1px solid rgba(34, 211, 238, 0.2)",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "16px",
                        fontWeight: 700,
                        marginBottom: "10px",
                      }}
                    >
                      Join the Club
                    </h4>
                    <p
                      style={{
                        fontSize: "12px",
                        color: "rgba(255,255,255,0.5)",
                        marginBottom: "20px",
                      }}
                    >
                      Get updates on new drops and offers.
                    </p>
                    <div
                      style={{
                        display: "flex",
                        background: "rgba(255,255,255,0.05)",
                        borderRadius: "10px",
                        padding: "5px",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Your Email"
                        style={{
                          background: "none",
                          border: "none",
                          color: "#fff",
                          padding: "10px",
                          fontSize: "14px",
                          outline: "none",
                          width: "100%",
                        }}
                      />
                      <button
                        style={{
                          background: "#22d3ee",
                          color: "#000",
                          border: "none",
                          padding: "10px 15px",
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div
                  style={{
                    marginTop: "60px",
                    paddingTop: "20px",
                    borderTop: "1px solid rgba(255,255,255,0.05)",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: "12px",
                      color: "rgba(255,255,255,0.3)",
                      letterSpacing: "1px",
                    }}
                  >
                    © 2026 REINA SLIPPER STORE. DESIGNED FOR COMFORT.
                  </p>
                </div>
              </div>
            </footer>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
