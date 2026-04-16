"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle,
  Phone,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });
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
    if (validationError) {
      setError(validationError);
      return;
    }

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
            address: formData.address.trim(),
          },
        },
      });

      if (authError) {
        if (authError.message.includes("already")) {
          throw new Error("This email is already registered.");
        }
        throw authError;
      }

      if (!authData.user) throw new Error("Registration failed. Please try again.");

      const { error: profileError } = await supabase.from("profiles").upsert({
        id: authData.user.id,
        email: formData.email.trim(),
        full_name: formData.name.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        role: "customer",
      } as any);

      if (profileError) console.error("Profile sync error:", profileError);

      if (authData.session) {
        await supabase.auth.signOut();
      }

      setEmailSent(true);
    } catch (err: any) {
      setError(err.message || "An error occurred during registration.");
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="app-surface min-h-screen flex items-center justify-center p-5">
        <div className="glass-panel w-full max-w-[24rem] p-10 text-center rounded-[1.25rem]">
          <div className="w-14 h-14 rounded-full bg-emerald-400/12 border border-emerald-300/20 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={28} className="text-emerald-300" />
          </div>
          <h2 className="section-title text-2xl text-white mb-2">Verify Email</h2>
          <p className="text-sm text-white/50 leading-relaxed mb-6">
            Account created for <b>{formData.email}</b>. Verify email (if required), then login to open your customer dashboard.
          </p>
          <Link href="/login?next=/customer-dashboard" className="btn-primary-modern block py-3">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="app-surface min-h-screen flex items-center justify-center p-5">
      <div className="glass-panel w-full max-w-104 p-8 rounded-[1.25rem]">
        <div className="text-center mb-6">
          <h2 className="section-title text-[1.6rem] text-white">Create Account</h2>
          <p className="text-xs text-white/45 mt-1">Join Reina shopping community</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-400/25 bg-red-500/10 text-red-300 text-xs px-3 py-2 flex items-center gap-2">
            <AlertCircle size={14} /> {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-3.5">
          <div className="grid grid-cols-[1.2fr_0.8fr] gap-3">
            <Field label="FULL NAME" icon={<User size={15} />}>
              <input
                className="input-modern pl-10"
                type="text"
                placeholder="Ishan E."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Field>

            <Field label="PHONE" icon={<Phone size={15} />}>
              <input
                className="input-modern pl-10"
                type="tel"
                placeholder="07XXXXXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Field>
          </div>

          <Field label="EMAIL ADDRESS" icon={<Mail size={15} />}>
            <input
              className="input-modern pl-10"
              type="email"
              placeholder="example@mail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </Field>

          <Field label="DELIVERY ADDRESS" icon={<MapPin size={15} />} iconTop>
            <textarea
              className="input-modern pl-10 min-h-16 resize-none"
              placeholder="Your location"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </Field>

          <Field label="PASSWORD" icon={<Lock size={15} />}>
            <div className="relative">
              <input
                className="input-modern pl-10 pr-10"
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/45 hover:text-white/70"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </Field>

          <button type="submit" className="btn-primary-modern w-full py-3 mt-1 flex items-center justify-center gap-2 disabled:opacity-60" disabled={isLoading}>
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <>Create Account <UserPlus size={16} /></>}
          </button>
        </form>

        <p className="text-center text-sm text-white/45 mt-5">
          Already have an account? {" "}
          <Link href="/login" className="text-cyan-300 hover:text-cyan-200 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  icon,
  iconTop,
  children,
}: {
  label: string;
  icon: ReactNode;
  iconTop?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="relative">
      <label className="text-[10px] text-white/45 mb-1 block font-semibold uppercase tracking-[0.05em]">{label}</label>
      <div className={`absolute left-3 text-white/35 pointer-events-none ${iconTop ? "top-[2.15rem]" : "top-9 -translate-y-1/2"}`}>
        {icon}
      </div>
      {children}
    </div>
  );
}
