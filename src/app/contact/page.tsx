"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div style={{ background: "#050508", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .ct-display { font-family: 'Syne', sans-serif !important; }

        @keyframes ct-fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ct-gradShift {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        @keyframes ct-pulse {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.5; }
        }
        @keyframes ct-checkPop {
          0%   { transform: scale(0) rotate(-10deg); opacity: 0; }
          70%  { transform: scale(1.2) rotate(5deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        .ct-fadeUp  { animation: ct-fadeUp 0.7s ease-out both; }
        .ct-d1 { animation-delay: 0.05s; }
        .ct-d2 { animation-delay: 0.15s; }
        .ct-d3 { animation-delay: 0.25s; }
        .ct-d4 { animation-delay: 0.35s; }

        .ct-grad {
          background: linear-gradient(135deg, #f97316 0%, #fb923c 30%, #fbbf24 60%, #f97316 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: ct-gradShift 3s ease infinite;
        }

        .ct-glass {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.07);
        }

        .ct-input {
          width: 100%;
          padding: 16px 20px;
          border-radius: 14px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 500;
          outline: none;
          transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
          box-sizing: border-box;
        }
        .ct-input::placeholder { color: rgba(255,255,255,0.25); }
        .ct-input:focus {
          border-color: rgba(249,115,22,0.5);
          background: rgba(249,115,22,0.04);
          box-shadow: 0 0 0 3px rgba(249,115,22,0.08);
        }

        .ct-info-card {
          padding: 28px 32px;
          border-radius: 20px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          display: flex;
          align-items: flex-start;
          gap: 20px;
          transition: background 0.3s ease, border-color 0.3s ease, transform 0.3s ease;
          cursor: default;
        }
        .ct-info-card:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(249,115,22,0.2);
          transform: translateY(-2px);
        }

        .ct-submit-btn {
          width: 100%;
          padding: 20px;
          border-radius: 16px;
          border: none;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          font-size: 1rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
          position: relative;
          overflow: hidden;
          background: linear-gradient(90deg, #ea580c, #f97316, #f59e0b);
          color: #fff;
          box-shadow: 0 0 30px rgba(249,115,22,0.4), 0 0 60px rgba(249,115,22,0.15);
        }
        .ct-submit-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 0 40px rgba(249,115,22,0.6), 0 0 80px rgba(249,115,22,0.2);
        }
        .ct-submit-btn:active { transform: scale(0.99); }

        .ct-check-pop { animation: ct-checkPop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }

        .ct-map-wrap {
          transition: filter 0.7s ease;
          filter: grayscale(1) brightness(0.4) sepia(0.3);
        }
        .ct-map-wrap:hover {
          filter: grayscale(0) brightness(0.9);
        }
      `}</style>

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <div
        style={{
          position: "relative",
          padding: "7rem 1.5rem 5rem",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* BG */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 80% 70% at 50% 0%, #1a0a2e 0%, #0d0618 40%, #050508 80%)",
        }} />
        {/* Grid */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.04,
          backgroundImage: "linear-gradient(rgba(249,115,22,.8) 1px,transparent 1px),linear-gradient(90deg,rgba(249,115,22,.8) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }} />
        {/* Orb */}
        <div style={{
          position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)",
          width: 600, height: 300, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(249,115,22,0.12) 0%, transparent 70%)",
          filter: "blur(40px)", pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Badge */}
          <div className="ct-glass ct-fadeUp" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            borderRadius: 9999, padding: "8px 20px", marginBottom: 32,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%", background: "#f97316",
              boxShadow: "0 0 8px rgba(249,115,22,0.8)",
              animation: "ct-pulse 2s ease-in-out infinite",
            }} />
            <span style={{ color: "rgba(251,146,60,0.9)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.35em" }}>
              We&apos;re Here to Help
            </span>
          </div>

          <h1 className="ct-display ct-fadeUp ct-d1" style={{
            fontWeight: 900, textTransform: "uppercase",
            fontSize: "clamp(2.8rem,8vw,6rem)",
            lineHeight: 0.9, color: "#fff", margin: "0 0 24px",
            letterSpacing: "-0.03em",
          }}>
            Get in{" "}
            <span className="ct-grad">Touch</span>
          </h1>

          <p className="ct-fadeUp ct-d2" style={{
            color: "#94a3b8", fontSize: "clamp(1rem,2vw,1.15rem)",
            fontWeight: 300, maxWidth: 520, margin: "0 auto",
            lineHeight: 1.7,
          }}>
            Have a question about an order or our slippers?<br />
            <span style={{ color: "rgba(251,146,60,0.7)" }}>We reply within 24 hours.</span>
          </p>
        </div>
      </div>

      {/* ══ MAIN CONTENT ══════════════════════════════════════════ */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem 8rem" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 40, alignItems: "start",
        }}>

          {/* ── LEFT: Info ── */}
          <div className="ct-fadeUp ct-d2" style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            <h2 className="ct-display" style={{
              fontWeight: 800, textTransform: "uppercase",
              letterSpacing: "0.05em", color: "#fff",
              fontSize: "1.1rem", marginBottom: 8,
            }}>
              Contact Details
            </h2>

            {/* Phone */}
            <div className="ct-info-card">
              <div style={{
                width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                background: "rgba(249,115,22,0.12)", color: "#f97316",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 16px rgba(249,115,22,0.15)",
              }}>
                <Phone size={22} />
              </div>
              <div>
                <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.3em", color: "#64748b", marginBottom: 6 }}>
                  Call Us
                </p>
                <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>+94 77 123 4567</p>
                <p style={{ fontSize: 12, color: "#64748b", fontWeight: 400, marginTop: 2 }}>Mon – Sat, 9 AM – 7 PM</p>
              </div>
            </div>

            {/* Email */}
            <div className="ct-info-card">
              <div style={{
                width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                background: "rgba(168,85,247,0.12)", color: "#a855f7",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 16px rgba(168,85,247,0.15)",
              }}>
                <Mail size={22} />
              </div>
              <div>
                <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.3em", color: "#64748b", marginBottom: 6 }}>
                  Email Us
                </p>
                <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff" }}>hello@reinastore.lk</p>
                <p style={{ fontSize: 12, color: "#64748b", fontWeight: 400, marginTop: 2 }}>We reply within 24 hours</p>
              </div>
            </div>

            {/* Location */}
            <div className="ct-info-card">
              <div style={{
                width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                background: "rgba(34,197,94,0.12)", color: "#22c55e",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 16px rgba(34,197,94,0.15)",
              }}>
                <MapPin size={22} />
              </div>
              <div>
                <p style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.3em", color: "#64748b", marginBottom: 6 }}>
                  Our Store
                </p>
                <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", lineHeight: 1.5 }}>
                  123 Reina Street,<br />Colombo 03, Sri Lanka.
                </p>
              </div>
            </div>

            {/* Working Hours card */}
            <div style={{
              padding: "28px 32px",
              borderRadius: 20,
              background: "linear-gradient(135deg, rgba(249,115,22,0.12) 0%, rgba(251,146,60,0.06) 100%)",
              border: "1px solid rgba(249,115,22,0.2)",
              boxShadow: "0 0 40px -10px rgba(249,115,22,0.2)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: "rgba(249,115,22,0.15)", color: "#f97316",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Clock size={18} />
                </div>
                <h3 className="ct-display" style={{
                  fontWeight: 800, textTransform: "uppercase",
                  letterSpacing: "0.05em", color: "#fff", fontSize: "0.9rem",
                }}>
                  Working Hours
                </h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#94a3b8", fontSize: "0.875rem", fontWeight: 400 }}>Monday – Saturday</span>
                  <span style={{ color: "#fff", fontSize: "0.875rem", fontWeight: 700 }}>9:00 AM – 7:00 PM</span>
                </div>
                <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#94a3b8", fontSize: "0.875rem", fontWeight: 400 }}>Sunday</span>
                  <span style={{ color: "rgba(249,115,22,0.7)", fontSize: "0.875rem", fontWeight: 700 }}>Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Form ── */}
          <div className="ct-glass ct-fadeUp ct-d3" style={{ borderRadius: 28, padding: "40px 36px" }}>

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: "rgba(249,115,22,0.12)", color: "#f97316",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <MessageSquare size={20} />
              </div>
              <h3 className="ct-display" style={{
                fontWeight: 800, textTransform: "uppercase",
                letterSpacing: "0.05em", color: "#fff", fontSize: "1rem",
              }}>
                Send a Message
              </h3>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.3em", color: "#64748b" }}>
                    Your Name
                  </label>
                  <input
                    className="ct-input"
                    type="text"
                    placeholder="Dilani P."
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <label style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.3em", color: "#64748b" }}>
                    Email
                  </label>
                  <input
                    className="ct-input"
                    type="email"
                    placeholder="dilani@gmail.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.3em", color: "#64748b" }}>
                  Subject
                </label>
                <input
                  className="ct-input"
                  type="text"
                  placeholder="How can we help?"
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <label style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.3em", color: "#64748b" }}>
                  Message
                </label>
                <textarea
                  className="ct-input"
                  rows={5}
                  placeholder="Type your message here..."
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  required
                  style={{ resize: "none" }}
                />
              </div>

              <button type="submit" className="ct-submit-btn">
                {sent ? (
                  <>
                    <CheckCircle size={20} className="ct-check-pop" />
                    Message Sent!
                  </>
                ) : (
                  <>
                    Send Message
                    <Send size={18} />
                  </>
                )}
              </button>

            </form>
          </div>
        </div>
      </div>

      {/* ══ MAP ═══════════════════════════════════════════════════ */}
      <div style={{ position: "relative" }}>
        {/* top fade */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 80, zIndex: 2,
          background: "linear-gradient(to bottom, #050508, transparent)",
          pointerEvents: "none",
        }} />
        {/* bottom fade */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 80, zIndex: 2,
          background: "linear-gradient(to top, #050508, transparent)",
          pointerEvents: "none",
        }} />

        <div
          className="ct-map-wrap"
          style={{ width: "100%", height: 420, overflow: "hidden" }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.58290458315!2d79.78616403222224!3d6.92183352733979!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a70ad%3A0x2db3513fa168c16d!2sColombo!5e0!3m2!1sen!2slk!4v1700000000000!5m2!1sen!2slk"
            width="100%"
            height="420"
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

    </div>
  );
}