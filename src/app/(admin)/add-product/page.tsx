"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowLeft, Upload, Loader2, X } from "lucide-react";
import Link from "next/link";
// useRouter import කරන්න
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AddProductPage() {
  const router = useRouter(); // router එක initialize කරන්න
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "Streetwear",
    stock: "0"
  });
  
  const [colors, setColors] = useState<string[]>([]);
  const [currentColor, setCurrentColor] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const addColor = () => {
    if (currentColor && !colors.includes(currentColor)) {
      setColors([...colors, currentColor]);
      setCurrentColor("");
    }
  };

  const removeColor = (colorToRemove: string) => {
    setColors(colors.filter(c => c !== colorToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = "";
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `products/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('slipper-images').upload(filePath, imageFile);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from('slipper-images').getPublicUrl(filePath);
        imageUrl = publicUrlData.publicUrl;
      }

      const { error: dbError } = await supabase
        .from('products')
        .insert([{
          name: formData.name,
          price: parseFloat(formData.price),
          description: formData.description,
          category: formData.category,
          stock_quantity: parseInt(formData.stock),
          colors: colors,
          image_url: imageUrl
        }]);

      if (dbError) throw dbError;
      
      alert("Product Added Successfully! ✅");
      router.push("/dashboard"); // දැන් මෙය නිවැරදිව වැඩ කරනු ඇත
      
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 lg:p-12 text-black font-sans">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 mb-8 hover:text-black font-bold text-[10px] uppercase tracking-[0.2em]">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-10">Add Product.</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-4xl shadow-xl p-10 space-y-6 border border-gray-100">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Name</label>
              <input type="text" required className="w-full p-4 rounded-2xl bg-gray-50 border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-black outline-none font-bold text-black" 
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Stock Quantity</label>
              <input type="number" required className="w-full p-4 rounded-2xl bg-gray-50 border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-black outline-none font-bold text-black" 
              value={formData.stock} onChange={(e) => setFormData({...formData, stock: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Available Colors</label>
            <div className="flex gap-2 mb-3 flex-wrap">
              {colors.map(c => (
                <span key={c} className="bg-black text-white px-4 py-2 rounded-full text-xs font-black flex items-center gap-2 uppercase italic">
                  {c} <X size={14} className="cursor-pointer text-red-400" onClick={() => removeColor(c)} />
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" placeholder="Ex: Black, Red" className="flex-1 p-4 rounded-2xl bg-gray-50 ring-1 ring-gray-100 focus:ring-2 focus:ring-black outline-none font-bold text-black" 
              value={currentColor} onChange={(e) => setCurrentColor(e.target.value)} />
              <button type="button" onClick={addColor} className="bg-gray-100 px-6 rounded-2xl font-black text-xs uppercase hover:bg-black hover:text-white transition-colors">Add</button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Price (Rs.)</label>
              <input type="number" required className="w-full p-4 rounded-2xl bg-gray-50 border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-black outline-none font-bold text-blue-600" 
              value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Image</label>
              <div className="relative border-2 border-dashed border-gray-100 rounded-2xl p-4 text-center hover:border-black transition-colors">
                <input type="file" required className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
                <Upload className="mx-auto text-gray-300 mb-1" size={20} />
                <p className="text-[10px] font-bold text-gray-400 uppercase truncate px-2">{imageFile ? imageFile.name : "Choose Photo"}</p>
              </div>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Description</label>
            <textarea rows={3} className="w-full p-4 rounded-2xl bg-gray-50 border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-black outline-none font-bold text-black" 
            value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          </div>

          <button disabled={loading} className="w-full bg-black text-white py-5 rounded-3xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-600 transition-all disabled:bg-gray-400 shadow-xl shadow-gray-200">
            {loading ? <Loader2 className="animate-spin" /> : "PUBLISH PRODUCT"}
          </button>
        </form>
      </div>
    </div>
  );
}