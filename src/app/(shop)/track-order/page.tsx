"use client";

import { Search, Truck } from "lucide-react";
import { useState } from "react";

export default function TrackOrder() {
  const [orderId, setOrderId] = useState("");

  return (
    <div className="max-w-3xl mx-auto p-6 lg:py-20 font-sans text-center">
      <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8">
        <Truck size={40} className="text-blue-600" />
      </div>
      <h1 className="text-3xl font-black text-gray-900 uppercase mb-4">Track Your Order</h1>
      <p className="text-gray-500 mb-10 max-w-md mx-auto">
        Enter your Order ID (received via SMS/Email) to check the current delivery status.
      </p>

      <div className="relative max-w-md mx-auto">
        <input 
          type="text" 
          placeholder="Order ID (e.g. REINA-1234)"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="w-full p-5 rounded-2xl border-2 border-gray-100 focus:border-blue-600 outline-none transition-all pr-16 font-bold"
        />
        <button className="absolute right-3 top-3 bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-all">
          <Search size={24} />
        </button>
      </div>

      <div className="mt-12 p-8 border border-dashed border-gray-200 rounded-3xl">
        <p className="text-sm text-gray-400 italic">
          Enter a valid ID to see tracking information.
        </p>
      </div>
    </div>
  );
}