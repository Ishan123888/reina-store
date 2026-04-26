// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ORDER SUCCESS PAGE  →  src/app/order-success/[id]/page.tsx
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle2, Copy, Truck, Download, Loader2 } from "lucide-react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/core/configs/supabase-browser";

function isAbortLikeError(error: unknown) {
  if (error instanceof DOMException) {
    return error.name === "AbortError";
  }
  if (error && typeof error === "object") {
    const known = error as { name?: string; message?: string };
    return known.name === "AbortError" || known.message === "signal is aborted without reason";
  }
  return false;
}

export default function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [generatingInvoice, setGeneratingInvoice] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadOrder() {
      try {
        const supabase = getSupabaseBrowserClient();
        const { data, error } = await supabase.from("orders").select("*").eq("id", id).single();
        if (error) throw error;
        if (isActive) setOrder(data || null);
      } catch (error) {
        if (!isAbortLikeError(error)) {
          console.error("Order success load failed:", error);
        }
      }
    }

    loadOrder();
    return () => { isActive = false; };
  }, [id]);

  const copyId = async () => {
    try { await navigator.clipboard.writeText(String(id)); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  };

  const downloadInvoice = async () => {
    setGeneratingInvoice(true);
    try {
      const response = await fetch(`/api/invoices/${id}`);
      const html = await response.text();
      const blob = new Blob([html], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url; link.download = `Invoice-${String(id).substring(0, 8).toUpperCase()}.html`;
      document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url);
    } catch (error) {
      if (!isAbortLikeError(error)) {
        alert("Failed to generate invoice");
      }
    } finally { setGeneratingInvoice(false); }
  };

  return (
    <div className="app-shell" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'DM Sans',sans-serif", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes card-in{from{opacity:0;transform:translateY(32px) scale(0.96)}to{opacity:1;transform:translateY(0) scale(1)}}
        @keyframes check-pop{0%{transform:scale(0) rotate(-10deg);opacity:0}70%{transform:scale(1.15) rotate(3deg)}100%{transform:scale(1) rotate(0);opacity:1}}
        @keyframes glow{0%,100%{box-shadow:0 0 30px rgba(16,185,129,0.25)}50%{box-shadow:0 0 60px rgba(16,185,129,0.5)}}
        .card-in{animation:card-in 0.7s cubic-bezier(0.22,1,0.36,1) both}
        .check-pop{animation:check-pop 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.3s both}
        .glow-pulse{animation:glow 2.5s ease-in-out infinite}
        .action-btn{padding:14px 20px;border-radius:14px;font-family:'Syne',sans-serif;font-weight:800;font-size:10px;text-transform:uppercase;letter-spacing:0.15em;cursor:pointer;border:none;display:flex;align-items:center;justify-content:center;gap:8px;transition:all 0.3s ease;flex:1;text-decoration:none}
      `}</style>

      <div style={{ position: "absolute", top: "10%", left: "15%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle,rgba(16,185,129,0.1) 0%,transparent 70%)", filter: "blur(80px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "10%", right: "10%", width: 350, height: 350, borderRadius: "50%", background: "radial-gradient(circle,rgba(6,182,212,0.08) 0%,transparent 70%)", filter: "blur(70px)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(6,182,212,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,0.02) 1px,transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

      <div className="card-in" style={{ maxWidth: 480, width: "100%", position: "relative" }}>
        <div className="glass-card" style={{ borderRadius: 28, padding: "48px 36px", position: "relative", overflow: "hidden", textAlign: "center" }}>
          <div style={{ position: "absolute", top: 0, left: "20%", right: "20%", height: 1, background: "linear-gradient(90deg,transparent,rgba(16,185,129,0.5),transparent)" }} />

          {/* Check icon */}
          <div className="check-pop glow-pulse" style={{ width: 72, height: 72, borderRadius: "50%", margin: "0 auto 24px", background: "linear-gradient(135deg,rgba(16,185,129,0.2),rgba(6,182,212,0.1))", border: "1px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckCircle2 size={36} style={{ color: "#34d399" }} />
          </div>

          <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: "1.8rem", fontWeight: 900, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.03em" }}>Order Confirmed!</h1>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: "0 0 28px", lineHeight: 1.6 }}>🚚 Your order has been received. Pay cash on delivery.</p>

          {/* Order ID */}
          <div style={{ background: "rgba(6,182,212,0.06)", border: "1px solid rgba(6,182,212,0.15)", borderRadius: 16, padding: "18px 20px", marginBottom: 20, textAlign: "left" }}>
            <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.3em", color: "rgba(6,182,212,0.5)", margin: "0 0 10px" }}>Order ID</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#22d3ee", wordBreak: "break-all", margin: 0 }}>{id}</p>
              <button onClick={copyId} style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(6,182,212,0.1)", border: "1px solid rgba(6,182,212,0.2)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all 0.2s" }}>
                <Copy size={14} style={{ color: copied ? "#34d399" : "#22d3ee" }} />
              </button>
            </div>
            {order?.status && <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", margin: "10px 0 0", fontWeight: 600 }}>Status: <span style={{ color: "#fff" }}>{order.status}</span></p>}
            {order?.total_amount && <p style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", margin: "6px 0 0", fontWeight: 600 }}>Total: <span style={{ color: "#22d3ee", fontSize: 14, fontWeight: 800, fontFamily: "'Syne',sans-serif" }}>Rs. {order.total_amount?.toLocaleString()}</span></p>}
          </div>

          {/* COD badge */}
          <div style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: 12, padding: "12px 16px", marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", flexShrink: 0 }} />
            <p style={{ fontSize: 11, color: "rgba(52,211,153,0.8)", fontWeight: 600, margin: 0 }}>Cash on Delivery — Pay on arrival</p>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <button onClick={downloadInvoice} disabled={generatingInvoice} className="action-btn" style={{ background: "linear-gradient(135deg,rgba(6,182,212,0.2),rgba(14,165,233,0.15))", border: "1px solid rgba(6,182,212,0.25)", color: "#22d3ee" }}>
              {generatingInvoice ? <Loader2 size={14} style={{ animation: "spin 0.8s linear infinite" }} /> : <Download size={14} />}
              {generatingInvoice ? "Generating..." : "Invoice"}
            </button>
            <Link href={`/track-order?orderId=${encodeURIComponent(String(id))}`} className="action-btn" style={{ background: "linear-gradient(135deg,#0ea5e9,#06b6d4)", color: "#fff" }}>
              <Truck size={14} /> Track Order
            </Link>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link href="/collections" className="action-btn" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }}>
              Continue Shopping
            </Link>
            <Link href="/" className="action-btn" style={{ background: "none", border: "none", color: "rgba(6,182,212,0.5)" }}>
              Go Home
            </Link>
          </div>
        </div>
        <div style={{ position: "absolute", inset: 0, borderRadius: 28, background: "linear-gradient(135deg,rgba(16,185,129,0.04),rgba(6,182,212,0.03))", transform: "translateY(8px) scale(0.98)", filter: "blur(20px)", zIndex: -1 }} />
      </div>
    </div>
  );
}
