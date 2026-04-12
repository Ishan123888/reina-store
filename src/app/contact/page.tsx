"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle, Sparkles, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });

  // Industry Standard Validation Logic
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    // Name validation
    if (form.name.trim().length < 3) newErrors.name = "Name is too short";
    
    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email address";
    
    // Phone validation (Regex for SL numbers or basic international format)
    if (!/^(?:0|94|\+94)?(?:7(0|1|2|4|5|6|7|8)\d{7})$/.test(form.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Invalid contact number";
    }

    // Subject & Message validation
    if (form.subject.trim().length < 5) newErrors.subject = "Subject is too short";
    if (form.message.trim().length < 10) newErrors.message = "Message must be at least 10 characters";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    // API Call Simulation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSent(true);
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    setTimeout(() => setSent(false), 5000);
  };

  const infoCards = [
    { icon: Phone, label: "Call Us", value: "+94 77 123 4567", sub: "Mon – Sat, 9 AM – 7 PM", color: "#22d3ee" },
    { icon: Mail, label: "Email Us", value: "hello@reinastore.lk", sub: "We reply within 24 hours", color: "#818cf8" },
    { icon: MapPin, label: "Our Store", value: "123 Reina Street, Colombo 03", sub: "Sri Lanka", color: "#34d399" },
  ];

  const bgImageUrl = "https://i.imgur.com/6VS5Ue8.png";

  return (
    <div style={{ 
      minHeight: "100vh", 
      backgroundColor: "#020408", 
      backgroundImage: `linear-gradient(rgba(2, 4, 8, 0.82), rgba(2, 4, 8, 0.82)), url("${bgImageUrl}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      fontFamily: "'Inter', sans-serif", 
      position: "relative", 
      overflowX: "hidden", 
      paddingBottom: 40 
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Syne:wght@600;700&display=swap');
        
        .fade-up { animation: fade-up 0.6s ease-out both; }
        @keyframes fade-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        
        .glass { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.08); }
        
        .input-group { position: relative; width: 100%; }
        .glass-input { 
          background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.1); 
          color: #fff; width: 100%; padding: 12px 16px; border-radius: 12px; font-size: 14px; 
          outline: none; transition: 0.2s; box-sizing: border-box; font-family: 'Inter', sans-serif;
        }
        .glass-input:focus { border-color: #22d3ee; background: rgba(6, 182, 212, 0.05); }
        .error-text { color: #ef4444; font-size: 11px; margin-top: 4px; display: flex; align-items: center; gap: 4px; }
        
        .send-btn { 
          width: 100%; padding: 14px; border: none; border-radius: 12px; cursor: pointer;
          background: linear-gradient(135deg, #0ea5e9, #06b6d4); color: #fff;
          font-weight: 600; font-size: 14px; transition: 0.3s; font-family: 'Inter', sans-serif;
        }
        .send-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .send-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(6, 182, 212, 0.3); }
      `}</style>

      {/* Background Dots Overlay */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px 0", position: "relative", zIndex: 1 }}>
        
        {/* Header Section */}
        <div className="fade-up" style={{ textAlign: "center", marginBottom: 50 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(34, 211, 238, 0.1)", padding: "5px 12px", borderRadius: 20, marginBottom: 16 }}>
            <Sparkles size={12} style={{ color: "#22d3ee" }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: "#22d3ee", letterSpacing: "1px", textTransform: "uppercase" }}>Contact Us</span>
          </div>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, color: "#fff", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
            Let's Start a <span style={{ color: "#22d3ee" }}>Conversation</span>
          </h1>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.6)", maxWidth: 500, margin: "0 auto", fontWeight: 400, lineHeight: 1.6 }}>
            Have questions about our slippers? Reach out to us and we'll get back to you within 24 hours.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 30, alignItems: "start" }}>
          
          {/* Info Side */}
          <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {infoCards.map((card, i) => (
              <div key={i} className="glass" style={{ padding: 22, borderRadius: 18, display: "flex", gap: 18, alignItems: "center" }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: `${card.color}15`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${card.color}30` }}>
                  <card.icon size={18} style={{ color: card.color }} />
                </div>
                <div>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", margin: "0 0 2px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>{card.label}</p>
                  <p style={{ fontSize: 14, color: "#fff", margin: 0, fontWeight: 500 }}>{card.value}</p>
                  {card.sub && <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "0", marginTop: 2 }}>{card.sub}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Form Side */}
          <div className="glass fade-up" style={{ padding: 32, borderRadius: 24 }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="input-group">
                  <input className="glass-input" placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                  {errors.name && <span className="error-text"><AlertCircle size={10}/> {errors.name}</span>}
                </div>
                <div className="input-group">
                  <input className="glass-input" type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                  {errors.email && <span className="error-text"><AlertCircle size={10}/> {errors.email}</span>}
                </div>
              </div>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="input-group">
                  <input className="glass-input" placeholder="Phone (e.g. 077...)" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                  {errors.phone && <span className="error-text"><AlertCircle size={10}/> {errors.phone}</span>}
                </div>
                <div className="input-group">
                  <input className="glass-input" placeholder="Subject" value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} />
                  {errors.subject && <span className="error-text"><AlertCircle size={10}/> {errors.subject}</span>}
                </div>
              </div>

              <div className="input-group">
                <textarea className="glass-input" placeholder="How can we help you?" style={{ height: 110, resize: "none" }} value={form.message} onChange={e => setForm({...form, message: e.target.value})} />
                {errors.message && <span className="error-text"><AlertCircle size={10}/> {errors.message}</span>}
              </div>

              <button type="submit" disabled={isSubmitting} className="send-btn">
                {isSubmitting ? "Sending..." : sent ? "Message Sent!" : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div style={{ marginTop: 80, position: "relative" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 100, background: "linear-gradient(to bottom, #020408, transparent)", zIndex: 2 }}></div>
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.798511776515!2d79.8482!3d6.9147!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2594000000001%3A0x0!2zNsKwNTQnNTIuOSJOIDc5wrA1MCc1My41IkU!5e0!3m2!1sen!2slk!4v1700000000000!5m2!1sen!2slk"
          width="100%" height="400" style={{ border: 0, opacity: 0.7, filter: "invert(90%) hue-rotate(180deg) brightness(0.8)" }} allowFullScreen loading="lazy" />
      </div>

      <style>{`@media(max-width:768px){div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}