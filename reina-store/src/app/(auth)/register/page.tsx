"use client";

import Link from "next/link";
import { useState } from "react";
import { UserPlus, Mail, Lock, User, Loader2, Eye, EyeOff, CheckCircle, Phone, MapPin, AlertCircle } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", address: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const validateForm = () => {
    const { name, email, phone, address, password } = formData;
    
    if (!name || !email || !phone || !address || !password) return "All fields are required.";
    if (name.trim().length < 3) return "Name must be at least 3 characters long.";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return "Please enter a valid email address.";
    
    const phoneRegex = /^(07[0-9]{8})$/;
    if (!phoneRegex.test(phone.trim())) return "Enter a valid Sri Lankan phone number (e.g., 0712345678).";
    
    if (address.trim().length < 5) return "Please provide a more complete address.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    
    return null;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) { setError(validationError); return; }

    setIsLoading(true); 
    setError(null);
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email.trim(), 
        password: formData.password,
        options: { 
          data: { 
            full_name: formData.name.trim(), 
            phone: formData.phone.trim(), 
            address: formData.address.trim() 
          } 
        }
      });

      if (authError) {
        if (authError.message.includes("already")) throw new Error("This email is already registered.");
        throw authError;
      }
      
      if (!authData.user) throw new Error("Registration failed. Please try again.");

      // Creating Profile Record
      const { error: profileError } = await supabase.from("profiles").upsert({ 
        id: authData.user.id, 
        email: formData.email.trim(), 
        full_name: formData.name.trim(), 
        phone: formData.phone.trim(), 
        address: formData.address.trim(), 
        role: "customer" 
      } as any);

      if (profileError) console.error("Profile sync error:", profileError);
      
      setEmailSent(true);
    } catch (err: any) { 
      setError(err.message || "An error occurred during registration."); 
    } finally { 
      setIsLoading(false); 
    }
  };

  const commonBg = {
    minHeight: "100vh", backgroundColor: "#020408", display: "flex", alignItems: "center", justifyContent: "center",
    padding: "20px", fontFamily: "'Inter', sans-serif",
    backgroundImage: `radial-gradient(circle at 50% -20%, #111827, transparent), radial-gradient(circle at 0% 100%, #030712, transparent)`
  };

  if (emailSent) return (
    <div style={commonBg}>
      <div style={{ background: "rgba(255, 255, 255, 0.02)", backdropFilter: "blur(20px)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: 20, padding: "40px", width: "100%", maxWidth: "380px", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, background: "rgba(45, 212, 191, 0.1)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <CheckCircle size={28} style={{ color: "#2dd4bf" }} />
        </div>
        <h2 style={{ fontFamily: "'Syne', sans-serif", color: "#fff", fontSize: "1.4rem", marginBottom: "8px" }}>Verify Email</h2>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.5, marginBottom: "24px" }}>Verification link sent to <b>{formData.email}</b>. Please check your inbox.</p>
        <Link href="/login" style={{ display: "block", background: "#fff", color: "#000", padding: "12px", borderRadius: "10px", textDecoration: "none", fontWeight: 600, fontSize: "14px" }}>Back to Login</Link>
      </div>
    </div>
  );

  return (
    <div style={commonBg}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Syne:wght@700;800&display=swap');
        .glass-card { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; }
        .input-group { position: relative; width: 100%; }
        .input-field { background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.1); color: #fff; width: 100%; padding: 11px 12px 11px 40px; border-radius: 10px; font-size: 13.5px; outline: none; transition: 0.2s; box-sizing: border-box; }
        .input-field:focus { border-color: #22d3ee; background: rgba(34, 211, 238, 0.05); box-shadow: 0 0 0 1px #22d3ee; }
        .icon-overlay { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: rgba(255,255,255,0.2); pointer-events: none; }
        .btn-main { background: #fff; color: #000; width: 100%; padding: 12px; border: none; border-radius: 10px; font-weight: 600; font-size: 14px; cursor: pointer; transition: 0.3s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .btn-main:hover:not(:disabled) { background: #22d3ee; transform: translateY(-1px); }
        .label-text { font-size: 10px; color: rgba(255,255,255,0.4); margin-bottom: 5px; display: block; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
      `}</style>

      <div className="glass-card" style={{ width: "100%", maxWidth: "420px", padding: "32px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.4rem", color: "#fff", margin: 0 }}>Create Account</h2>
          <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", marginTop: "4px" }}>Join Reina shopping community</p>
        </div>

        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "8px 12px", borderRadius: 8, fontSize: "12px", display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "12px" }}>
            <div className="input-group">
              <label className="label-text">FULL NAME</label>
              <div className="icon-overlay"><User size={15}/></div>
              <input className="input-field" type="text" placeholder="Ishan E." value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div className="input-group">
              <label className="label-text">PHONE</label>
              <div className="icon-overlay"><Phone size={15}/></div>
              <input className="input-field" type="tel" placeholder="07XXXXXXXX" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
            </div>
          </div>

          <div className="input-group">
            <label className="label-text">EMAIL ADDRESS</label>
            <div className="icon-overlay"><Mail size={15}/></div>
            <input className="input-field" type="email" placeholder="example@mail.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
          </div>

          <div className="input-group">
            <label className="label-text">DELIVERY ADDRESS</label>
            <div className="icon-overlay" style={{ top: "38px" }}><MapPin size={15}/></div>
            <textarea className="input-field" style={{ height: "60px", paddingLeft: "40px", paddingTop: "12px", resize: "none" }} placeholder="Your location" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} />
          </div>

          <div className="input-group">
            <label className="label-text">PASSWORD</label>
            <div className="icon-overlay"><Lock size={15}/></div>
            <input className="input-field" type={showPassword ? "text" : "password"} placeholder="Minimum 6 characters" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: "absolute", right: 12, top: "33px", background: "none", border: "none", color: "rgba(255,255,255,0.2)", cursor: "pointer" }}>
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          <button type="submit" className="btn-main" disabled={isLoading} style={{ marginTop: "10px" }}>
            {isLoading ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <>Create Account <UserPlus size={16} /></>}
          </button>
        </form>

        <p style={{ textAlign: "center", fontSize: "13px", color: "rgba(255,255,255,0.4)", marginTop: "20px" }}>
          Already have an account? <Link href="/login" style={{ color: "#22d3ee", textDecoration: "none", fontWeight: 600 }}>Login</Link>
        </p>
      </div>
    </div>
  );
}