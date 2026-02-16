import Link from 'next/link';
// ArrowRight පාවිච්චි කරන නිසා දැන් error එක ඉවත් වේවි
import { ShoppingBag, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col bg-white">
      {/* Hero Section */}
      <section className="relative bg-gray-900 h-[80vh] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1603487759130-107d643831b0?q=80&w=2070')] bg-cover bg-center"></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl font-sans">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
            Step into Comfort with <span className="text-blue-500">Reina</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 text-gray-300">
            Premium slippers designed for style and durability. 
            Islandwide Cash on Delivery available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/collections" 
              className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-bold flex items-center justify-center transition-all transform hover:scale-105"
            >
              Shop Now 
              <ShoppingBag className="ml-2 group-hover:hidden" size={20} />
              {/* මෙතනදී ArrowRight පාවිච්චි කරලා තියෙනවා */}
              <ArrowRight className="ml-2 hidden group-hover:block animate-bounce-x" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Section placeholder */}
      <div className="py-20 text-center border-t border-gray-100">
        <h2 className="text-3xl font-bold text-gray-900">New Arrivals</h2>
        <p className="text-gray-500 mt-2 font-sans">Check out our latest slipper designs below.</p>
      </div>
    </div>
  );
}