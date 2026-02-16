"use client";

import { ShoppingCart } from "lucide-react";
// Next.js Image component එක import කරන්න
import Image from "next/image";

const PRODUCTS = [
  { id: '1', name: 'Reina Urban Slide', price: 1850, image: 'https://images.unsplash.com/photo-1603487759130-107d643831b0?q=80&w=600' },
  { id: '2', name: 'Reina Comfort Pro', price: 2450, image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600' },
];

export default function CollectionsPage() {
  return (
    <div className="p-10 max-w-7xl mx-auto">
      <h1 className="text-3xl font-black mb-8 text-gray-900">Our Collections</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {PRODUCTS.map(p => (
          <div key={p.id} className="group border border-gray-100 rounded-2xl p-4 hover:shadow-2xl transition-all duration-300 bg-white">
            {/* Optimized Image Container */}
            <div className="relative w-full h-56 mb-4 overflow-hidden rounded-xl bg-gray-100">
              <Image 
                src={p.image} 
                alt={p.name} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            </div>

            <h3 className="font-bold text-lg text-gray-800">{p.name}</h3>
            <p className="text-blue-600 font-black mt-1 text-xl">Rs. {p.price.toLocaleString()}</p>
            
            <button className="mt-5 w-full bg-gray-900 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors font-bold">
              <ShoppingCart size={20} /> Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}