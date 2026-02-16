"use client";

import Link from "next/link";
import { useState } from "react";
import { UserPlus, Mail, Lock, User } from "lucide-react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    password: "" 
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // දැන් formData භාවිතා වන නිසා ESLint error එකක් එන්නේ නැත
    console.log("Registering User:", formData);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-xl p-10">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 uppercase">Create Account</h1>
          <p className="text-gray-500 font-medium mt-2">Join Reina Slipper Store today</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {/* Full Name Input */}
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Full Name" 
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 focus:border-blue-600 outline-none transition-all bg-gray-50/50"
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="email" 
              placeholder="Email Address" 
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 focus:border-blue-600 outline-none transition-all bg-gray-50/50"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="password" 
              placeholder="Create Password" 
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 focus:border-blue-600 outline-none transition-all bg-gray-50/50"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            REGISTER <UserPlus size={20} />
          </button>
        </form>

        <p className="text-center mt-8 text-gray-500 font-medium">
          Already have an account? <Link href="/login" className="text-blue-600 font-bold hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}