"use client";

import Link from 'next/link';
import { ShoppingCart, User, Menu, Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';
// අපි කලින් හදපු useCart එක import කරන්න
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Context එකෙන් cartCount එක ලබා ගැනීම
  const { cartCount } = useCart();

  // Next.js hydration error එක නැති කිරීමට මෙය භාවිතා කරයි
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 font-sans">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-black tracking-tighter text-blue-600">
          REINA<span className="text-gray-900">.</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8 font-medium text-gray-600 uppercase text-[11px] tracking-widest">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <Link href="/collections" className="hover:text-blue-600 transition-colors">Shop</Link>
          <Link href="/track-order" className="hover:text-blue-600 transition-colors">Track Order</Link>
          <Link href="/contact" className="hover:text-blue-600 transition-colors">Contact</Link>
        </div>

        {/* Action Icons */}
        <div className="flex items-center space-x-5">
          <button className="text-gray-600 hover:text-blue-600 outline-none">
            <Search size={20} />
          </button>
          
          <Link href="/cart" className="relative group text-gray-600 hover:text-blue-600">
            <ShoppingCart size={22} className="group-hover:-translate-y-0.5 transition-transform" />
            
            {/* Mounted නම් පමණක් පෙන්වන්න (Hydration Fix) */}
            {mounted && cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-in zoom-in duration-300">
                {cartCount}
              </span>
            )}
          </Link>
          
          <Link href="/login" className="text-gray-600 hover:text-blue-600">
            <User size={22} />
          </Link>
          
          {/* Mobile Menu Toggle */}
          <button className="md:hidden outline-none" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 p-6 flex flex-col space-y-6 font-bold text-gray-800 uppercase text-xs tracking-[0.2em] animate-in slide-in-from-top duration-300">
          <Link href="/" onClick={() => setIsOpen(false)}>Home</Link>
          <Link href="/collections" onClick={() => setIsOpen(false)}>Shop</Link>
          <Link href="/track-order" onClick={() => setIsOpen(false)}>Track Order</Link>
          <Link href="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
        </div>
      )}
    </nav>
  );
}