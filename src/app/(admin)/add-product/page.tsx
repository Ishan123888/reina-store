"use client";

import { useState, useEffect, useRef } from "react";
import { createBrowserClient } from "@supabase/ssr";
import {
  ArrowLeft,
  Upload,
  Loader2,
  X,
  Pencil,
  Trash2,
  PlusCircle,
  Package,
  Tag,
} from "lucide-react";
import Link from "next/link";

function useSupabase() {
  const ref = useRef(
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  );
  return ref.current;
}

const CATEGORIES = [
  "Casual", "Formal", "Sport", "Beach", "Home", "Kids", "Ladies", "Gents",
];

export default function AddProductPage() {
  const supabase = useSupabase();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const emptyForm = {
    name: "", price: "", description: "",
    category: "Casual", stock: "0", item_id: "",
  };
  const [formData, setFormData] = useState(emptyForm);
  const [colors, setColors] = useState<string[]>([]);
  const [currentColor, setCurrentColor] = useState("");
  const [sizes, setSizes] = useState<string[]>([]);
  const [currentSize, setCurrentSize] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);

  const showToast = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products").select("*").order("created_at", { ascending: false });
    if (!error) setProducts(data || []);
  };

  useEffect(() => { fetchProducts(); }, []);

  const addTag = (
    value: string, list: string[],
    setList: (v: string[]) => void, setInput: (v: string) => void
  ) => {
    const t = value.trim();
    if (t && !list.includes(t)) { setList([...list, t]); setInput(""); }
  };

  const removeTag = (value: string, list: string[], setList: (v: string[]) => void) =>
    setList(list.filter((i) => i !== value));

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (colors.length === 0 || sizes.length === 0) {
      showToast("Please add at least one Color and Size.", "err");
      return;
    }
    setLoading(true);
    try {
      let imageUrl = "";
      if (imageFile) {
        const ext = imageFile.name.split(".").pop();
        const path = `products/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("slipper-images").upload(path, imageFile);
        if (upErr) throw upErr;
        const { data: urlData } = supabase.storage
          .from("slipper-images").getPublicUrl(path);
        imageUrl = urlData.publicUrl;
      }

      const payload: any = {
        name: formData.name,
        item_id: formData.item_id,
        price: parseFloat(formData.price),
        description: formData.description,
        category: formData.category,
        stock_quantity: parseInt(formData.stock),
        colors,
        sizes,
      };
      if (imageUrl) payload.image_url = imageUrl;

      if (editingId) {
        const { error } = await supabase.from("products").update(payload).eq("id", editingId);
        if (error) throw error;
        showToast("Product updated successfully!");
      } else {
        const { error } = await supabase.from("products").insert([payload]);
        if (error) throw error;
        showToast("Product published successfully!");
      }

      setFormData(emptyForm);
      setColors([]); setSizes([]);
      setImageFile(null); setImagePreview(null);
      setEditingId(null);
      fetchProducts();
    } catch (err: any) {
      showToast("Failed: " + err.message, "err");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    await supabase.from("products").delete().eq("id", id);
    setDeleteConfirm(null);
    fetchProducts();
    showToast("Product deleted.");
  };

  const startEdit = (p: any) => {
    setEditingId(p.id);
    setFormData({
      name: p.name || "", item_id: p.item_id || "",
      price: p.price?.toString() || "",
      description: p.description || "",
      category: p.category || "Casual",
      stock: p.stock_quantity?.toString() || "0",
    });
    setColors(Array.isArray(p.colors) ? p.colors : []);
    setSizes(Array.isArray(p.sizes) ? p.sizes : []);
    setImagePreview(p.image_url || null);
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setColors([]); setSizes([]);
    setImageFile(null); setImagePreview(null);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0d0010 0%, #180015 40%, #0d0010 100%)",
      fontFamily: "'DM Sans', sans-serif",
      padding: "32px 24px 80px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        .ap-display { font-family: 'Syne', sans-serif !important; }

        @keyframes ap-fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ap-gradShift {
          0%,100% { background-position: 0% 50%; }
          50%      { background-position: 100% 50%; }
        }
        @keyframes ap-toastIn {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes ap-spin { to { transform: rotate(360deg); } }

        .ap-fadeUp { animation: ap-fadeUp 0.6s ease-out both; }
        .ap-d2 { animation-delay: 0.12s; }

        .ap-grad-text {
          background: linear-gradient(135deg, #f9a8d4 0%, #f472b6 40%, #ec4899 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: ap-gradShift 4s ease infinite;
        }

        .ap-glass {
          background: rgba(255,255,255,0.03);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.07);
        }

        .ap-input {
          width: 100%;
          padding: 14px 18px;
          border-radius: 14px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .ap-input::placeholder { color: rgba(255,255,255,0.2); }
        .ap-input:focus {
          border-color: rgba(244,114,182,0.5);
          background: rgba(244,114,182,0.05);
          box-shadow: 0 0 0 3px rgba(244,114,182,0.08);
        }

        .ap-select {
          width: 100%;
          padding: 14px 18px;
          border-radius: 14px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          outline: none;
          cursor: pointer;
          transition: border-color 0.2s, box-shadow 0.2s;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23f472b6' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 16px center;
          padding-right: 40px;
          box-sizing: border-box;
        }
        .ap-select option { background: #1a0018; color: #fff; }
        .ap-select:focus {
          border-color: rgba(244,114,182,0.5);
          box-shadow: 0 0 0 3px rgba(244,114,182,0.08);
        }

        .ap-label {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: rgba(244,114,182,0.5);
          margin-bottom: 8px;
        }

        .ap-tag-pink {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(244,114,182,0.12);
          border: 1px solid rgba(244,114,182,0.2);
          color: #f9a8d4;
          padding: 5px 12px; border-radius: 9999px;
          font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.05em;
        }
        .ap-tag-violet {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(167,139,250,0.12);
          border: 1px solid rgba(167,139,250,0.2);
          color: #c4b5fd;
          padding: 5px 12px; border-radius: 9999px;
          font-size: 11px; font-weight: 700;
        }

        .ap-add-tag-btn {
          padding: 12px 20px; border-radius: 12px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.6);
          font-family: 'DM Sans', sans-serif;
          font-size: 11px; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }
        .ap-add-tag-btn:hover {
          background: rgba(244,114,182,0.12);
          border-color: rgba(244,114,182,0.3);
          color: #f472b6;
        }

        .ap-submit {
          width: 100%;
          padding: 18px;
          border-radius: 16px;
          border: none;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          font-size: 13px; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.15em;
          color: #fff;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: transform 0.2s, box-shadow 0.2s;
          background: linear-gradient(135deg, #be185d, #ec4899, #f472b6);
          box-shadow: 0 0 24px rgba(236,72,153,0.35);
        }
        .ap-submit:hover:not(:disabled) {
          transform: scale(1.02);
          box-shadow: 0 0 36px rgba(236,72,153,0.55);
        }
        .ap-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        .ap-cancel {
          width: 100%;
          padding: 18px;
          border-radius: 16px;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          font-size: 12px; font-weight: 800;
          text-transform: uppercase; letter-spacing: 0.1em;
          color: rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.2s;
        }
        .ap-cancel:hover { color: #f87171; border-color: rgba(248,113,113,0.3); }

        .ap-tr { transition: background 0.2s; }
        .ap-tr:hover { background: rgba(244,114,182,0.04); }

        .ap-toast {
          position: fixed; bottom: 32px; right: 32px; z-index: 9999;
          padding: 14px 22px; border-radius: 16px;
          display: flex; align-items: center; gap: 10px;
          font-size: 13px; font-weight: 600;
          animation: ap-toastIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both;
          backdrop-filter: blur(20px);
        }

        .ap-icon-btn-pink {
          width: 36px; height: 36px; border-radius: 10px;
          background: rgba(244,114,182,0.1);
          border: 1px solid rgba(244,114,182,0.15);
          color: #f472b6;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.2s;
        }
        .ap-icon-btn-pink:hover { background: rgba(244,114,182,0.22); }

        .ap-icon-btn-red {
          width: 36px; height: 36px; border-radius: 10px;
          background: rgba(248,113,113,0.08);
          border: 1px solid rgba(248,113,113,0.15);
          color: #f87171;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background 0.2s;
        }
        .ap-icon-btn-red:hover { background: rgba(248,113,113,0.22); }

        .ap-upload-label {
          display: block;
          border: 2px dashed rgba(244,114,182,0.2);
          border-radius: 18px;
          padding: 24px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          background: rgba(244,114,182,0.03);
        }
        .ap-upload-label:hover { border-color: rgba(244,114,182,0.45); }

        .ap-delete-btn {
          flex: 1;
          padding: 16px;
          border-radius: 14px;
          background: rgba(248,113,113,0.12);
          border: 1px solid rgba(248,113,113,0.3);
          color: #f87171;
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          transition: background 0.2s;
        }
        .ap-delete-btn:hover { background: rgba(248,113,113,0.22); }
      `}</style>

      {/* ── Toast ── */}
      {toast && (
        <div className="ap-toast" style={
          toast.type === "ok"
            ? { background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.3)", color: "#6ee7b7" }
            : { background: "rgba(248,113,113,0.15)", border: "1px solid rgba(248,113,113,0.3)", color: "#fca5a5" }
        }>
          <span>{toast.type === "ok" ? "✓" : "✕"}</span>
          {toast.msg}
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirm && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div className="ap-glass" style={{ borderRadius: 24, padding: 40, maxWidth: 360, width: "90%", textAlign: "center" }}>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: "1rem", marginBottom: 8 }}>
              Delete Product?
            </p>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 28 }}>
              This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button onClick={() => setDeleteConfirm(null)} className="ap-cancel" style={{ flex: 1 }}>
                Cancel
              </button>
              <button onClick={() => deleteProduct(deleteConfirm)} className="ap-delete-btn">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        {/* Back link */}
        <Link href="/dashboard" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          color: "rgba(244,114,182,0.5)", textDecoration: "none",
          fontSize: 10, fontWeight: 700, textTransform: "uppercase",
          letterSpacing: "0.3em", marginBottom: 32,
        }}>
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        {/* ══ FORM CARD ════════════════════════════════════════════ */}
        <div className="ap-glass ap-fadeUp" style={{ borderRadius: 28, padding: "36px 36px 40px", marginBottom: 32 }}>

          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "center", marginBottom: 36, flexWrap: "wrap", gap: 12,
          }}>
            <div>
              <h1 className="ap-display" style={{
                fontSize: "clamp(1.6rem,4vw,2.2rem)", fontWeight: 800,
                letterSpacing: "-0.04em", color: "#fff", lineHeight: 1,
              }}>
                {editingId
                  ? <><span className="ap-grad-text">Edit</span> Product</>
                  : <><span className="ap-grad-text">New</span> Arrival</>
                }
              </h1>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 6, fontWeight: 400 }}>
                {editingId ? "Modify existing product details below." : "Fill in the details to publish a new product."}
              </p>
            </div>
            {editingId && (
              <button onClick={cancelEdit} className="ap-cancel" style={{ width: "auto", padding: "10px 20px" }}>
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 32,
            }}>

              {/* ── LEFT ── */}
              <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

                {/* Item ID + Name */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 14 }}>
                  <div>
                    <label className="ap-label">Item ID</label>
                    <input className="ap-input" type="text" placeholder="R001"
                      value={formData.item_id}
                      onChange={(e) => setFormData({ ...formData, item_id: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="ap-label">Product Name *</label>
                    <input className="ap-input" type="text" required placeholder="e.g. CloudWalk Pro"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="ap-label"><Tag size={9} /> Category</label>
                  <select className="ap-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="ap-label">Description</label>
                  <textarea className="ap-input" rows={3} placeholder="Short product description..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{ resize: "none" }}
                  />
                </div>

                {/* Colors */}
                <div>
                  <label className="ap-label">Available Colors *</label>
                  {colors.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                      {colors.map((c) => (
                        <span key={c} className="ap-tag-pink">
                          {c}
                          <X size={11} style={{ cursor: "pointer", opacity: 0.7 }}
                            onClick={() => removeTag(c, colors, setColors)} />
                        </span>
                      ))}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 10 }}>
                    <input className="ap-input" placeholder="e.g. Black, Red..."
                      value={currentColor}
                      onChange={(e) => setCurrentColor(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag(currentColor, colors, setColors, setCurrentColor))}
                      style={{ flex: 1 }}
                    />
                    <button type="button" className="ap-add-tag-btn"
                      onClick={() => addTag(currentColor, colors, setColors, setCurrentColor)}>
                      + Add
                    </button>
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <label className="ap-label">Available Sizes *</label>
                  {sizes.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                      {sizes.map((s) => (
                        <span key={s} className="ap-tag-violet">
                          {s}
                          <X size={11} style={{ cursor: "pointer", opacity: 0.7 }}
                            onClick={() => removeTag(s, sizes, setSizes)} />
                        </span>
                      ))}
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 10 }}>
                    <input className="ap-input" placeholder="e.g. 6, 7, 8, 9..."
                      value={currentSize}
                      onChange={(e) => setCurrentSize(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag(currentSize, sizes, setSizes, setCurrentSize))}
                      style={{ flex: 1 }}
                    />
                    <button type="button" className="ap-add-tag-btn"
                      onClick={() => addTag(currentSize, sizes, setSizes, setCurrentSize)}>
                      + Add
                    </button>
                  </div>
                </div>
              </div>

              {/* ── RIGHT ── */}
              <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>

                {/* Price + Stock */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <label className="ap-label">Price (Rs.) *</label>
                    <input className="ap-input" type="number" required placeholder="1999"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      style={{ color: "#f9a8d4" }}
                    />
                  </div>
                  <div>
                    <label className="ap-label">Stock Qty *</label>
                    <input className="ap-input" type="number" required placeholder="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    />
                  </div>
                </div>

                {/* Image */}
                <div>
                  <label className="ap-label">Product Image</label>
                  <label className="ap-upload-label">
                    <input type="file" accept="image/*" style={{ display: "none" }}
                      onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                    />
                    {imagePreview ? (
                      <div>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imagePreview} alt="Preview" style={{
                          width: "100%", maxHeight: 200,
                          objectFit: "contain", borderRadius: 12,
                        }} />
                        <p style={{ marginTop: 10, fontSize: 11, color: "rgba(244,114,182,0.6)", fontWeight: 600 }}>
                          Click to change image
                        </p>
                      </div>
                    ) : (
                      <>
                        <Upload size={28} style={{ color: "rgba(244,114,182,0.3)", margin: "0 auto 10px", display: "block" }} />
                        <p style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.3)" }}>
                          Click to upload image
                        </p>
                        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.15)", marginTop: 4 }}>
                          PNG, JPG, WEBP supported
                        </p>
                      </>
                    )}
                  </label>
                </div>

                {/* Buttons */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: "auto" }}>
                  <button type="submit" className="ap-submit" disabled={loading}>
                    {loading
                      ? <Loader2 size={18} style={{ animation: "ap-spin 0.8s linear infinite" }} />
                      : editingId
                        ? <><Pencil size={16} /> Update Product</>
                        : <><PlusCircle size={16} /> Publish Product</>
                    }
                  </button>
                  {editingId && (
                    <button type="button" className="ap-cancel" onClick={cancelEdit}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* ══ TABLE ════════════════════════════════════════════════ */}
        <div className="ap-glass ap-fadeUp ap-d2" style={{ borderRadius: 28, overflow: "hidden" }}>

          <div style={{
            padding: "22px 30px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <h2 className="ap-display" style={{ fontSize: "1.05rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
                Inventory Control
              </h2>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
                {products.length} product{products.length !== 1 ? "s" : ""} in store
              </p>
            </div>
            <div style={{
              padding: "6px 16px", borderRadius: 9999,
              background: "rgba(244,114,182,0.1)",
              border: "1px solid rgba(244,114,182,0.2)",
              color: "#f472b6", fontSize: 11, fontWeight: 700,
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <Package size={12} />
              {products.length} Items
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  {["Product", "Item ID", "Category", "Colors", "Sizes", "Price & Stock", "Actions"].map((h) => (
                    <th key={h} style={{
                      padding: "14px 24px", textAlign: "left",
                      fontSize: 9, fontWeight: 700,
                      textTransform: "uppercase", letterSpacing: "0.25em",
                      color: "rgba(255,255,255,0.25)", whiteSpace: "nowrap",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{
                      padding: "60px 24px", textAlign: "center",
                      color: "rgba(255,255,255,0.2)", fontSize: 13, fontWeight: 500,
                    }}>
                      No products yet — add your first one above.
                    </td>
                  </tr>
                ) : products.map((p, idx) => (
                  <tr key={p.id} className="ap-tr" style={{
                    borderBottom: idx < products.length - 1
                      ? "1px solid rgba(255,255,255,0.04)" : "none",
                  }}>

                    {/* Product */}
                    <td style={{ padding: "16px 24px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                        <div style={{
                          width: 48, height: 48, borderRadius: 12, overflow: "hidden",
                          border: "1px solid rgba(255,255,255,0.08)", flexShrink: 0,
                          background: "rgba(255,255,255,0.04)",
                        }}>
                          {p.image_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.image_url} alt={p.name}
                              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                          ) : (
                            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Package size={18} style={{ color: "rgba(255,255,255,0.2)" }} />
                            </div>
                          )}
                        </div>
                        <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "#fff" }}>
                          {p.name}
                        </p>
                      </div>
                    </td>

                    {/* Item ID */}
                    <td style={{ padding: "16px 24px" }}>
                      <span style={{
                        fontFamily: "monospace", fontSize: 11,
                        color: "rgba(244,114,182,0.6)",
                        background: "rgba(244,114,182,0.08)",
                        border: "1px solid rgba(244,114,182,0.12)",
                        padding: "4px 10px", borderRadius: 8,
                      }}>
                        {p.item_id || "—"}
                      </span>
                    </td>

                    {/* Category */}
                    <td style={{ padding: "16px 24px" }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700,
                        textTransform: "uppercase", letterSpacing: "0.1em",
                        color: "rgba(167,139,250,0.8)",
                        background: "rgba(167,139,250,0.1)",
                        border: "1px solid rgba(167,139,250,0.15)",
                        padding: "4px 10px", borderRadius: 8,
                      }}>
                        {p.category || "Casual"}
                      </span>
                    </td>

                    {/* Colors */}
                    <td style={{ padding: "16px 24px" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {Array.isArray(p.colors) && p.colors.length > 0
                          ? p.colors.map((c: string) => (
                            <span key={c} style={{
                              fontSize: 10, fontWeight: 700,
                              background: "rgba(244,114,182,0.1)",
                              border: "1px solid rgba(244,114,182,0.15)",
                              color: "#f9a8d4", padding: "3px 8px", borderRadius: 6,
                            }}>{c}</span>
                          ))
                          : <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>—</span>
                        }
                      </div>
                    </td>

                    {/* Sizes */}
                    <td style={{ padding: "16px 24px" }}>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                        {Array.isArray(p.sizes) && p.sizes.length > 0
                          ? p.sizes.map((s: string) => (
                            <span key={s} style={{
                              fontSize: 11, fontWeight: 700,
                              background: "rgba(167,139,250,0.1)",
                              border: "1px solid rgba(167,139,250,0.15)",
                              color: "#c4b5fd", padding: "3px 9px", borderRadius: 6,
                            }}>{s}</span>
                          ))
                          : <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12 }}>—</span>
                        }
                      </div>
                    </td>

                    {/* Price & Stock */}
                    <td style={{ padding: "16px 24px" }}>
                      <p className="ap-display" style={{
                        fontSize: "0.95rem", fontWeight: 800,
                        color: "#f9a8d4", letterSpacing: "-0.01em",
                      }}>
                        Rs. {p.price?.toLocaleString()}
                      </p>
                      <p style={{
                        fontSize: 10, fontWeight: 700, marginTop: 3,
                        textTransform: "uppercase", letterSpacing: "0.05em",
                        color: p.stock_quantity > 0 ? "#34d399" : "#f87171",
                      }}>
                        {p.stock_quantity > 0 ? `${p.stock_quantity} In Stock` : "Out of Stock"}
                      </p>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: "16px 24px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => startEdit(p)} title="Edit" className="ap-icon-btn-pink">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setDeleteConfirm(p.id)} title="Delete" className="ap-icon-btn-red">
                          <Trash2 size={14} />
                        </button>
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