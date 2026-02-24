"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { ArrowLeft, Upload, Loader2, X, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AddProductPage() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "Streetwear",
    stock: "0",
    item_id: "" 
  });

  const [colors, setColors] = useState<string[]>([]);
  const [currentColor, setCurrentColor] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [currentSize, setCurrentSize] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error("Fetch Error:", error);
    else setProducts(data || []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const addTag = (value: string, list: string[], setList: Function, setInput: Function) => {
    const trimmed = value.trim();
    if (trimmed && !list.includes(trimmed)) {
      setList([...list, trimmed]);
      setInput("");
    }
  };

  const removeTag = (value: string, list: string[], setList: Function) => {
    setList(list.filter(item => item !== value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (colors.length === 0 || sizes.length === 0) {
      alert("Please add at least one Color and Size.");
      return;
    }
    setLoading(true);

    try {
      let imageUrl = "";
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `products/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('slipper-images').upload(filePath, imageFile);
        if (uploadError) throw uploadError;
        const { data: publicUrlData } = supabase.storage.from('slipper-images').getPublicUrl(filePath);
        imageUrl = publicUrlData.publicUrl;
      }

      const payload: any = {
        name: formData.name,
        item_id: formData.item_id,
        price: parseFloat(formData.price),
        description: formData.description,
        category: formData.category,
        stock_quantity: parseInt(formData.stock),
        colors: colors,
        sizes: sizes
      };

      if (imageUrl) payload.image_url = imageUrl;

      if (editingId) {
        const { error } = await supabase.from('products').update(payload).eq('id', editingId);
        if (error) throw error;
        alert("Product Updated Successfully! ✨");
      } else {
        const { error } = await supabase.from('products').insert([payload]);
        if (error) throw error;
        alert("Product Added Successfully! ✅");
      }

      setFormData({ name: "", price: "", description: "", category: "Streetwear", stock: "0", item_id: "" });
      setColors([]);
      setSizes([]);
      setImageFile(null);
      setEditingId(null);
      fetchProducts();
    } catch (error: any) {
      alert("Action failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to delete this?")) {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    }
  };

  const startEdit = (p: any) => {
    setEditingId(p.id);
    setFormData({
      name: p.name || "",
      item_id: p.item_id || "",
      price: p.price?.toString() || "",
      description: p.description || "",
      category: p.category || "Streetwear",
      stock: p.stock_quantity?.toString() || "0"
    });
    setColors(Array.isArray(p.colors) ? p.colors : []);
    setSizes(Array.isArray(p.sizes) ? p.sizes : []);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] p-4 lg:p-10 text-black font-sans">
      <div className="max-w-6xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 mb-6 hover:text-black font-bold text-[10px] uppercase tracking-widest transition-colors">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        {/* --- FORM SECTION --- */}
        <div className="bg-white rounded-[40px] shadow-2xl shadow-gray-200/50 p-8 lg:p-12 border border-gray-100 mb-12">
          <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-8 text-black">
            {editingId ? "Edit Product." : "New Arrival."}
          </h1>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Item ID</label>
                  <input type="text" placeholder="R001" className="w-full p-4 rounded-2xl bg-gray-50 border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-black outline-none font-bold text-black"
                    value={formData.item_id} onChange={e => setFormData({...formData, item_id: e.target.value})} />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Product Name</label>
                  <input type="text" required className="w-full p-4 rounded-2xl bg-gray-50 border-none ring-1 ring-gray-100 focus:ring-2 focus:ring-black outline-none font-bold text-black"
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Available Colors</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {colors.map((c: string) => (
                    <span key={c} className="bg-black text-white px-3 py-1.5 rounded-full text-[10px] font-black flex items-center gap-2 uppercase italic">
                      {c} <X size={12} className="text-red-400 cursor-pointer" onClick={() => removeTag(c, colors, setColors)} />
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" placeholder="Add Color..." className="flex-1 p-4 rounded-2xl bg-gray-50 ring-1 ring-gray-100 outline-none font-bold text-sm text-black"
                    value={currentColor} onChange={e => setCurrentColor(e.target.value)} />
                  <button type="button" onClick={() => addTag(currentColor, colors, setColors, setCurrentColor)} className="bg-gray-100 px-6 rounded-2xl font-black text-[10px] uppercase hover:bg-black hover:text-white transition-all text-black">Add</button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Available Sizes</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {sizes.map((s: string) => (
                    <span key={s} className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-[10px] font-black flex items-center gap-2 uppercase">
                      {s} <X size={12} className="text-white cursor-pointer" onClick={() => removeTag(s, sizes, setSizes)} />
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" placeholder="Add Size (6, 7, 8...)" className="flex-1 p-4 rounded-2xl bg-gray-50 ring-1 ring-gray-100 outline-none font-bold text-sm text-black"
                    value={currentSize} onChange={e => setCurrentSize(e.target.value)} />
                  <button type="button" onClick={() => addTag(currentSize, sizes, setSizes, setCurrentSize)} className="bg-gray-100 px-6 rounded-2xl font-black text-[10px] uppercase hover:bg-blue-600 hover:text-white transition-all text-black">Add</button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Price (Rs.)</label>
                  <input type="number" required className="w-full p-4 rounded-2xl bg-gray-50 ring-1 ring-gray-100 focus:ring-2 focus:ring-black outline-none font-bold text-blue-600"
                    value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Stock Qty</label>
                  <input type="number" required className="w-full p-4 rounded-2xl bg-gray-50 ring-1 ring-gray-100 focus:ring-2 focus:ring-black outline-none font-bold text-black"
                    value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-gray-400 mb-2 block tracking-widest">Product Image</label>
                <div className="relative border-2 border-dashed border-gray-200 rounded-3xl p-8 text-center hover:border-black transition-all group bg-gray-50/30">
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setImageFile(e.target.files?.[0] || null)} />
                  <Upload className="mx-auto text-gray-300 group-hover:text-black mb-2 transition-colors" size={30} />
                  <p className="text-[10px] font-black uppercase text-gray-400 group-hover:text-black">{imageFile ? imageFile.name : "Select Image File"}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={loading} className={`flex-1 ${editingId ? 'bg-blue-600' : 'bg-black'} text-white py-5 rounded-3xl font-black text-xs tracking-[0.2em] uppercase flex items-center justify-center gap-3 shadow-xl hover:scale-[1.01] transition-all disabled:bg-gray-300`}>
                  {loading ? <Loader2 className="animate-spin" /> : editingId ? "Update Product" : "Publish Product"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* --- TABLE SECTION --- */}
        <div className="bg-white rounded-4xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
            <h2 className="text-xl font-black uppercase tracking-tighter text-black">Inventory Control</h2>
            <span className="text-[11px] font-bold bg-black text-white px-3 py-1 rounded-full uppercase">
              {products.length} Items
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black uppercase text-gray-400 tracking-[0.15em] bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Item ID</th>
                  <th className="px-6 py-4">Colors</th>
                  <th className="px-6 py-4">Sizes</th>
                  <th className="px-6 py-4">Price & Stock</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-blue-50/20 transition-all group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img src={p.image_url} className="w-12 h-12 rounded-xl object-cover border border-gray-200 shadow-sm" />
                        <div>
                          <p className="font-black text-sm uppercase text-black italic leading-tight">{p.name}</p>
                          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{p.category}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                       <span className="font-mono text-[10px] font-black text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{p.item_id || "N/A"}</span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(p.colors) && p.colors.length > 0 ? p.colors.map((c: string) => (
                          <span key={c} className="text-[10px] font-black bg-black text-white px-2 py-0.5 rounded-md uppercase italic">{c}</span>
                        )) : <span className="text-[10px] text-gray-300">N/A</span>}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(p.sizes) && p.sizes.length > 0 ? p.sizes.map((s: string) => (
                          <span key={s} className="text-[11px] font-extrabold bg-blue-100 text-blue-700 px-2.5 py-1 rounded-md">{s}</span>
                        )) : <span className="text-[11px] text-gray-300 font-bold">N/A</span>}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <p className="font-black text-blue-600 text-sm">Rs. {p.price}</p>
                      <p className={`text-[9px] font-black uppercase italic ${p.stock_quantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {p.stock_quantity > 0 ? `${p.stock_quantity} In Stock` : 'Out of Stock'}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => startEdit(p)} className="p-2.5 rounded-xl bg-gray-100 text-gray-600 hover:bg-black hover:text-white transition-all border border-gray-200"><Pencil size={14} /></button>
                        <button onClick={() => deleteProduct(p.id)} className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-100"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}