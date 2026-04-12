"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ShoppingCart, ArrowLeft, Loader2, CheckCircle2, Package, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { getSupabaseBrowserClient } from "@/core/configs/supabase-browser";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();
    supabase.from("products").select("*").eq("id", id).single()
      .then(({ data, error }) => {
        if (!error && data) {
          setProduct(data);
          if (data.colors?.length > 0) setSelectedColor(data.colors[0]);
          if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]);
        }
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, { color: selectedColor, size: selectedSize });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#020408,#040d1a,#020810)",display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <Loader2 size={36} style={{color:"#22d3ee",animation:"spin 0.8s linear infinite"}} />
      <p style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.3em",color:"rgba(255,255,255,0.3)",fontFamily:"'DM Sans',sans-serif"}}>Loading Product...</p>
    </div>
  );

  if (!product) return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#020408,#040d1a)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <p style={{color:"rgba(255,255,255,0.4)",fontFamily:"'DM Sans',sans-serif"}}>Product not found!</p>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#020408 0%,#040d1a 40%,#020810 70%,#060208 100%)",fontFamily:"'DM Sans',sans-serif",position:"relative",overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fade-in{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pop{0%{transform:scale(1)}50%{transform:scale(1.05)}100%{transform:scale(1)}}
        .fade-in{animation:fade-in 0.6s cubic-bezier(0.22,1,0.36,1) both}
        .d1{animation-delay:0.1s}.d2{animation-delay:0.2s}.d3{animation-delay:0.3s}
        
        .glass-panel{
          background:linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02));
          backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);
          border:1px solid rgba(255,255,255,0.08);
          box-shadow:0 24px 60px rgba(0,0,0,0.5);
        }
        .size-btn{
          padding:10px 18px;border-radius:12px;font-family:'Syne',sans-serif;
          font-size:11px;font-weight:800;cursor:pointer;transition:all 0.2s ease;
          background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);
          color:rgba(255,255,255,0.4);
        }
        .size-btn:hover{background:rgba(6,182,212,0.1);border-color:rgba(6,182,212,0.3);color:#22d3ee}
        .size-btn.active{background:rgba(6,182,212,0.18);border-color:rgba(6,182,212,0.5);color:#22d3ee;box-shadow:0 0 16px rgba(6,182,212,0.15)}
        .color-btn{
          padding:10px 18px;border-radius:12px;font-family:'Syne',sans-serif;
          font-size:11px;font-weight:800;cursor:pointer;transition:all 0.2s ease;
          background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);
          color:rgba(255,255,255,0.4);
        }
        .color-btn:hover{background:rgba(139,92,246,0.1);border-color:rgba(139,92,246,0.3);color:#c4b5fd}
        .color-btn.active{background:rgba(139,92,246,0.18);border-color:rgba(139,92,246,0.5);color:#c4b5fd;box-shadow:0 0 16px rgba(139,92,246,0.15)}
        
        .add-btn{
          width:100%;padding:18px;border:none;border-radius:16px;cursor:pointer;
          font-family:'Syne',sans-serif;font-size:13px;font-weight:900;
          text-transform:uppercase;letter-spacing:0.15em;
          display:flex;align-items:center;justify-content:center;gap:12px;
          transition:all 0.35s cubic-bezier(0.22,1,0.36,1);
          background:linear-gradient(135deg,#0ea5e9,#06b6d4,#0891b2);
          color:#fff;box-shadow:0 0 40px rgba(6,182,212,0.4),0 8px 24px rgba(0,0,0,0.3);
        }
        .add-btn:hover:not(:disabled){transform:translateY(-3px);box-shadow:0 0 60px rgba(6,182,212,0.6),0 16px 40px rgba(0,0,0,0.4)}
        .add-btn:disabled{opacity:0.5;cursor:not-allowed}
        .add-btn.added{background:linear-gradient(135deg,#10b981,#059669);box-shadow:0 0 40px rgba(16,185,129,0.4)}
      `}</style>

      {/* Orbs */}
      <div style={{position:"fixed",top:"10%",right:"10%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(6,182,212,0.08) 0%,transparent 70%)",filter:"blur(70px)",pointerEvents:"none"}} />
      <div style={{position:"fixed",bottom:"10%",left:"5%",width:350,height:350,borderRadius:"50%",background:"radial-gradient(circle,rgba(139,92,246,0.08) 0%,transparent 70%)",filter:"blur(60px)",pointerEvents:"none"}} />
      <div style={{position:"fixed",inset:0,backgroundImage:"linear-gradient(rgba(6,182,212,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,0.02) 1px,transparent 1px)",backgroundSize:"60px 60px",pointerEvents:"none"}} />

      <div style={{maxWidth:1200,margin:"0 auto",padding:"40px 24px",position:"relative",zIndex:1}}>
        <Link href="/collections" className="fade-in" style={{display:"inline-flex",alignItems:"center",gap:8,color:"rgba(99,212,240,0.5)",textDecoration:"none",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.3em",marginBottom:40,transition:"color 0.2s"}}>
          <ArrowLeft size={14}/> Back to Collections
        </Link>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:48,alignItems:"start"}} className="fade-in">

          {/* Image */}
          <div>
            <div className="glass-panel" style={{borderRadius:28,overflow:"hidden",position:"relative",aspectRatio:"1",border:"1px solid rgba(255,255,255,0.08)"}}>
              <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="(max-width:768px) 100vw, 50vw" />
              <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(2,4,8,0.3) 0%,transparent 50%)"}} />
              {/* Stock badge */}
              <div style={{position:"absolute",top:20,right:20,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(12px)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:12,padding:"8px 14px",display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:6,height:6,borderRadius:"50%",background:product.stock_quantity>0?"#22c55e":"#ef4444"}} />
                <span style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.2em",color:"rgba(255,255,255,0.7)"}}>
                  {product.stock_quantity>0?`${product.stock_quantity} In Stock`:"Out of Stock"}
                </span>
              </div>
            </div>

            {/* Rating display (decorative) */}
            <div className="glass-panel fade-in d1" style={{borderRadius:16,padding:"16px 20px",marginTop:16,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",gap:4}}>
                {[1,2,3,4,5].map(s=><Star key={s} size={14} fill="#f59e0b" style={{color:"#f59e0b"}} />)}
              </div>
              <span style={{fontSize:10,color:"rgba(255,255,255,0.35)",fontWeight:500}}>Premium Quality</span>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <Package size={12} style={{color:"rgba(6,182,212,0.5)"}} />
                <span style={{fontSize:10,color:"rgba(255,255,255,0.35)",fontWeight:500}}>Fast Delivery</span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="fade-in d2" style={{display:"flex",flexDirection:"column",gap:24}}>
            <div>
              <span style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.3em",color:"rgba(6,182,212,0.5)",display:"block",marginBottom:10}}>
                {product.category}
              </span>
              <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(1.8rem,4vw,2.6rem)",fontWeight:900,color:"#fff",margin:"0 0 12px",letterSpacing:"-0.04em",lineHeight:1}}>
                {product.name}
              </h1>
              <p style={{fontSize:"1.9rem",fontWeight:900,fontFamily:"'Syne',sans-serif",backgroundImage:"linear-gradient(135deg,#22d3ee,#818cf8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",margin:0}}>
                Rs. {product.price?.toLocaleString()}
              </p>
            </div>

            {/* Description */}
            <div className="glass-panel" style={{borderRadius:18,padding:"20px 22px",position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(6,182,212,0.3),transparent)"}} />
              <p style={{fontSize:13,color:"rgba(255,255,255,0.5)",lineHeight:1.7,margin:0,fontWeight:400}}>
                {product.description || "Premium quality footwear designed for exceptional comfort and style."}
              </p>
            </div>

            {/* Color Selection */}
            {product.colors?.length > 0 && (
              <div>
                <p style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.3em",color:"rgba(139,92,246,0.5)",marginBottom:12}}>
                  Select Color — <span style={{color:"#c4b5fd"}}>{selectedColor}</span>
                </p>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {product.colors.map((color: string) => (
                    <button key={color} className={`color-btn${selectedColor===color?" active":""}`}
                      onClick={() => setSelectedColor(color)}>{color}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {product.sizes?.length > 0 && (
              <div>
                <p style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.3em",color:"rgba(6,182,212,0.5)",marginBottom:12}}>
                  Select Size — <span style={{color:"#22d3ee"}}>{selectedSize}</span>
                </p>
                <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                  {product.sizes.map((size: string) => (
                    <button key={size} className={`size-btn${selectedSize===size?" active":""}`}
                      onClick={() => setSelectedSize(size)}>{size}</button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <div className="fade-in d3">
              <button className={`add-btn${added?" added":""}`}
                disabled={product.stock_quantity===0}
                onClick={handleAddToCart}>
                {added ? (
                  <><CheckCircle2 size={20}/> Added to Cart!</>
                ) : (
                  <><ShoppingCart size={20}/> Add to Cart</>
                )}
              </button>
              {product.stock_quantity === 0 && (
                <p style={{textAlign:"center",marginTop:10,fontSize:11,color:"rgba(239,68,68,0.6)",fontWeight:600}}>This product is currently out of stock.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media(max-width:768px){
          div[style*="grid-template-columns: 1fr 1fr"]{
            grid-template-columns:1fr !important;
          }
        }
      `}</style>
    </div>
  );
}