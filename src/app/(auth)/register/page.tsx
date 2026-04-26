"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { getSupabaseBrowserClient } from "@/core/configs/supabase-browser";
import { resolveUserRole } from "@/core/auth/auth-helpers";

/* Images */
const images = [
  "https://i.imgur.com/VG7Jjw0.jpeg",
  "https://i.imgur.com/nP2cWaY.jpeg",
  "https://imgur.com/K1YRX5o.png",
];

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  password: string;
}

export default function RegisterPage() {
  const [currentImage, setCurrentImage] = useState(0);

  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
  });

  const [focused, setFocused] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const supabase = getSupabaseBrowserClient();

  /* Background slider */
  useEffect(() => {
    const i = setInterval(() => {
      setCurrentImage((p) => (p + 1) % images.length);
    }, 4000);
    return () => clearInterval(i);
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.name,
          phone: form.phone,
          address: form.address,
        },
      },
    });

    if (!error) {
      await supabase.from("profiles").upsert({
        id: data.user?.id,
        email: form.email,
        full_name: form.name,
        phone: form.phone,
        address: form.address,
        role: resolveUserRole(undefined, form.email),
      });
      setSuccess(true);
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <CheckCircle size={42} className="text-green-400 mb-4 mx-auto" />
          <h2 className="text-white text-2xl font-semibold">
            Account Created
          </h2>
          <Link href="/login" className="text-cyan-400 mt-4 block">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-slate-950">

      {/* LEFT IMAGE */}
      <div className="relative hidden md:block">
        {images.map((img, i) => (
          <Image
            key={i}
            src={img}
            alt=""
            fill
            className={`object-cover transition-opacity duration-1000 ${
              i === currentImage ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* RIGHT FORM */}
      <div className="flex items-center justify-center px-6 py-12">
        <form className="w-full max-w-md space-y-6" onSubmit={handleRegister}>

          <div>
            <h1 className="text-2xl text-white font-semibold">
              Create account
            </h1>
            <p className="text-sm text-slate-400">
              Enter your details to continue
            </p>
          </div>

          {/* INPUTS */}
          {[
            { key: "name", label: "Full Name" },
            { key: "email", label: "Email" },
            { key: "phone", label: "Phone" },
            { key: "address", label: "Address" },
          ].map((field) => (
            <div key={field.key} className="relative">
              <input
                type="text"
                value={(form as any)[field.key]}
                onChange={(e) =>
                  setForm({ ...form, [field.key]: e.target.value })
                }
                onFocus={() => setFocused(field.key)}
                onBlur={() => setFocused(null)}
                className={`w-full px-4 pt-5 pb-2 rounded-xl bg-white/5 border transition-all text-white
                ${
                  focused === field.key
                    ? "border-cyan-400 ring-2 ring-cyan-400/30"
                    : "border-white/15"
                }`}
              />

              <label
                className={`absolute left-4 transition-all text-sm
                ${
                  focused === field.key ||
                  (form as any)[field.key]
                    ? "-top-2 text-xs text-cyan-400 bg-slate-950 px-1"
                    : "top-3 text-slate-400"
                }`}
              >
                {field.label}
              </label>
            </div>
          ))}

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              className={`w-full px-4 pt-5 pb-2 rounded-xl bg-white/5 border text-white transition-all
              ${
                focused === "password"
                  ? "border-cyan-400 ring-2 ring-cyan-400/30"
                  : "border-white/15"
              }`}
            />

            <label
              className={`absolute left-4 transition-all text-sm
              ${
                focused === "password" || form.password
                  ? "-top-2 text-xs text-cyan-400 bg-slate-950 px-1"
                  : "top-3 text-slate-400"
              }`}
            >
              Password
            </label>

            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {show ? <EyeOff /> : <Eye />}
            </button>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-medium transition"
          >
            {loading ? (
              <Loader2 className="animate-spin mx-auto" />
            ) : (
              "Create Account"
            )}
          </button>

          <p className="text-sm text-slate-400 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-cyan-400">
              Login
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}
