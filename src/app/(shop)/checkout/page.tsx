"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, PackageCheck, User, Truck, ShieldCheck, CreditCard } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getSupabaseBrowserClient } from "@/core/configs/supabase-browser";

const DELIVERY_FEE = 350;

type CheckoutForm = { name:string; email:string; phone:string; address:string; };

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [userId, setUserId] = useState<string|null>(null);
  const [form, setForm] = useState<CheckoutForm>({name:"",email:"",phone:"",address:""});
  const [error, setError] = useState<string|null>(null);
  const subtotal = cartTotal;
  const total = useMemo(()=>subtotal+DELIVERY_FEE,[subtotal]);

  useEffect(()=>{
    async function init(){
      const supabase = getSupabaseBrowserClient();
      const {data:{user}} = await supabase.auth.getUser();
      if(!user){setAuthLoading(false);return;}
      setUserId(user.id);
      const {data:profile} = await supabase.from("profiles").select("full_name,phone,address,email").eq("id",user.id).single();
      setForm(prev=>({...prev,name:(profile as any)?.full_name||"",email:(profile as any)?.email||user.email||"",phone:(profile as any)?.phone||"",address:(profile as any)?.address||""}));
      setAuthLoading(false);
    }
    init();
  },[]);

  const placeOrder = async()=>{
    setError(null);
    if(!userId){setError("Please login to place an order.");return;}
    if(cart.length===0){setError("Your cart is empty.");return;}
    if(!form.name.trim()||!form.phone.trim()||!form.address.trim()){setError("Please fill Name, Phone, and Address.");return;}
    setLoading(true);
    try{
      const supabase = getSupabaseBrowserClient();
      const items = cart.map(i=>({id:i.id,name:i.name,price:i.price,quantity:i.quantity,size:i.size,color:i.color,image_url:i.image_url}));
      try{await supabase.from("profiles").upsert({id:userId,email:form.email.trim()||null,full_name:form.name.trim(),phone:form.phone.trim(),address:form.address.trim(),role:"customer"} as any);}catch{}
      const basePayload:any = {customer_name:form.name.trim(),phone:form.phone.trim(),address:form.address.trim(),items,total_amount:total,status:"Pending"};
      const extPayload:any = {...basePayload,customer_email:form.email.trim()||null,user_id:userId,is_cod:true,shipping_fee:DELIVERY_FEE,subtotal_amount:subtotal};
      let insertedId:string|null=null;
      const {data,error:err} = await supabase.from("orders").insert([extPayload]).select("id").single();
      if(!err&&data?.id)insertedId=data.id;
      if(err){const {data:d2,error:e2}=await supabase.from("orders").insert([basePayload]).select("id").single();if(e2)throw e2;insertedId=d2?.id??null;}
      for(const item of items){
        const {data:prod}=await supabase.from("products").select("stock_quantity").eq("id",item.id).single();
        if(prod?.stock_quantity!=null)await supabase.from("products").update({stock_quantity:Math.max(0,prod.stock_quantity-item.quantity)}).eq("id",item.id);
      }
      clearCart();
      router.push(insertedId?`/order-success/${insertedId}`:"/collections");
    }catch(e:any){setError(e?.message||"Failed to place order.");}finally{setLoading(false);}
  };

  const inputStyle:any = {
    background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",
    color:"#fff",width:"100%",padding:"15px 18px",borderRadius:14,
    fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:500,
    outline:"none",transition:"all 0.25s ease",boxSizing:"border-box",
  };

  if(authLoading) return(
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#020408,#040d1a)",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <Loader2 size={36} style={{color:"#22d3ee",animation:"spin 0.8s linear infinite"}} />
    </div>
  );

  if(!userId) return(
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#020408,#040d1a,#020810)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"'DM Sans',sans-serif",position:"relative"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600&display=swap');`}</style>
      <div style={{position:"absolute",top:"20%",left:"20%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(6,182,212,0.07) 0%,transparent 70%)",filter:"blur(80px)"}} />
      <div style={{maxWidth:420,width:"100%",background:"linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))",backdropFilter:"blur(30px)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:28,padding:"44px 36px",boxShadow:"0 32px 80px rgba(0,0,0,0.5)"}}>
        <div style={{width:52,height:52,borderRadius:14,margin:"0 auto 20px",background:"linear-gradient(135deg,rgba(6,182,212,0.2),rgba(139,92,246,0.15))",border:"1px solid rgba(6,182,212,0.2)",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <User size={22} style={{color:"#22d3ee"}} />
        </div>
        <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"1.6rem",fontWeight:900,color:"#fff",textAlign:"center",margin:"0 0 8px",letterSpacing:"-0.03em"}}>Login Required</h1>
        <p style={{fontSize:12,color:"rgba(255,255,255,0.35)",textAlign:"center",marginBottom:28,lineHeight:1.6}}>Checkout is for registered customers. Please login to continue.</p>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <Link href="/login" style={{padding:"14px",borderRadius:14,background:"linear-gradient(135deg,#0ea5e9,#06b6d4)",color:"#fff",textDecoration:"none",fontFamily:"'Syne',sans-serif",fontWeight:800,fontSize:10,textTransform:"uppercase",letterSpacing:"0.15em",textAlign:"center"}}>Login</Link>
          <Link href="/register" style={{padding:"14px",borderRadius:14,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.09)",color:"rgba(255,255,255,0.5)",textDecoration:"none",fontFamily:"'Syne',sans-serif",fontWeight:700,fontSize:10,textTransform:"uppercase",letterSpacing:"0.15em",textAlign:"center"}}>Create Account</Link>
        </div>
      </div>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#020408 0%,#040d1a 40%,#020810 70%,#060208 100%)",fontFamily:"'DM Sans',sans-serif",paddingBottom:80,position:"relative",overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fade-in{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .fade-in{animation:fade-in 0.5s ease both}
        .glass{background:linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02));backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);border:1px solid rgba(255,255,255,0.08);box-shadow:0 20px 60px rgba(0,0,0,0.4)}
        input:focus,textarea:focus{background:rgba(99,212,240,0.06)!important;border-color:rgba(99,212,240,0.4)!important;box-shadow:0 0 0 3px rgba(99,212,240,0.08)!important}
        input::placeholder,textarea::placeholder{color:rgba(255,255,255,0.2)}
        textarea{resize:none}
        .place-btn{width:100%;padding:18px;border:none;border-radius:16px;cursor:pointer;background:linear-gradient(135deg,#0ea5e9,#06b6d4,#0891b2);color:#fff;font-family:'Syne',sans-serif;font-size:13px;font-weight:900;text-transform:uppercase;letter-spacing:0.15em;display:flex;align-items:center;justify-content:center;gap:12px;transition:all 0.35s cubic-bezier(0.22,1,0.36,1);box-shadow:0 0 40px rgba(6,182,212,0.4),0 8px 24px rgba(0,0,0,0.3)}
        .place-btn:hover:not(:disabled){transform:translateY(-3px);box-shadow:0 0 60px rgba(6,182,212,0.6),0 16px 40px rgba(0,0,0,0.4)}
        .place-btn:disabled{opacity:0.5;cursor:not-allowed}
        label{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.3em;color:rgba(99,212,240,0.5);display:block;margin-bottom:8px}
      `}</style>

      <div style={{position:"fixed",top:"5%",right:"5%",width:400,height:400,borderRadius:"50%",background:"radial-gradient(circle,rgba(6,182,212,0.07) 0%,transparent 70%)",filter:"blur(80px)",pointerEvents:"none"}} />
      <div style={{position:"fixed",bottom:"10%",left:"5%",width:350,height:350,borderRadius:"50%",background:"radial-gradient(circle,rgba(139,92,246,0.07) 0%,transparent 70%)",filter:"blur(60px)",pointerEvents:"none"}} />
      <div style={{position:"fixed",inset:0,backgroundImage:"linear-gradient(rgba(6,182,212,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,0.02) 1px,transparent 1px)",backgroundSize:"60px 60px",pointerEvents:"none"}} />

      <div style={{maxWidth:1100,margin:"0 auto",padding:"48px 24px 0",position:"relative",zIndex:1}}>
        <div className="fade-in" style={{marginBottom:40}}>
          <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:"clamp(2rem,5vw,3rem)",fontWeight:900,color:"#fff",margin:"0 0 6px",letterSpacing:"-0.04em"}}>
            Checkout<span style={{backgroundImage:"linear-gradient(135deg,#22d3ee,#818cf8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>.</span>
          </h1>
          <p style={{fontSize:11,color:"rgba(255,255,255,0.3)",fontWeight:400,margin:0}}>Cash on Delivery — Pay when you receive your order</p>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 360px",gap:24,alignItems:"start"}}>

          {/* Form */}
          <div className="glass fade-in" style={{borderRadius:24,padding:"32px 28px",position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(6,182,212,0.4),transparent)"}} />
            <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"1rem",fontWeight:900,color:"#fff",margin:"0 0 24px",display:"flex",alignItems:"center",gap:8}}>
              <Truck size={16} style={{color:"#22d3ee"}}/> Delivery Details
            </h2>

            {error&&<div style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.2)",borderRadius:12,padding:"12px 16px",marginBottom:20,fontSize:12,color:"#fca5a5",fontWeight:500}}>{error}</div>}

            <div style={{display:"flex",flexDirection:"column",gap:16}}>
              {[{key:"name",label:"Full Name",type:"text",ph:"Your full name"},{key:"email",label:"Email",type:"email",ph:"your@email.com"},{key:"phone",label:"Phone Number",type:"tel",ph:"07X XXX XXXX"}].map(f=>(
                <div key={f.key}>
                  <label>{f.label}</label>
                  <input style={inputStyle} type={f.type} placeholder={f.ph}
                    value={(form as any)[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:e.target.value}))} />
                </div>
              ))}
              <div>
                <label>Delivery Address</label>
                <textarea style={{...inputStyle,height:110}} placeholder="Full delivery address"
                  value={form.address} onChange={e=>setForm(p=>({...p,address:e.target.value}))} />
              </div>

              <button className="place-btn" style={{marginTop:8}} disabled={loading} onClick={placeOrder}>
                {loading?<Loader2 size={18} style={{animation:"spin 0.8s linear infinite"}}/>:<><PackageCheck size={18}/> Place Order (COD)</>}
              </button>

              <div style={{textAlign:"center"}}>
                <Link href="/cart" style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.2em",color:"rgba(255,255,255,0.25)",textDecoration:"none"}}>← Back to Cart</Link>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="glass fade-in" style={{borderRadius:24,overflow:"hidden",position:"sticky",top:24}}>
            <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"linear-gradient(90deg,transparent,rgba(6,182,212,0.4),transparent)"}} />
            <div style={{padding:"28px 24px"}}>
              <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:"1rem",fontWeight:900,color:"#fff",margin:"0 0 20px"}}>Order Summary</h2>
              <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
                {cart.map(i=>(
                  <div key={i.line_id} style={{display:"flex",justifyContent:"space-between",gap:12}}>
                    <div style={{minWidth:0}}>
                      <p style={{fontSize:11,fontWeight:700,color:"rgba(255,255,255,0.7)",margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{i.quantity}× {i.name}</p>
                      {(i.color||i.size)&&<p style={{fontSize:9,color:"rgba(255,255,255,0.3)",margin:"2px 0 0",fontWeight:500}}>{i.color?`${i.color}`:""}{i.color&&i.size?" · ":""}{i.size?`${i.size}`:""}</p>}
                    </div>
                    <p style={{fontSize:11,fontWeight:800,color:"rgba(255,255,255,0.6)",whiteSpace:"nowrap",margin:0}}>Rs. {(i.price*i.quantity)?.toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div style={{height:1,background:"rgba(255,255,255,0.06)",margin:"16px 0"}} />
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontSize:11,color:"rgba(255,255,255,0.4)",fontWeight:500}}>Subtotal</span>
                  <span style={{fontSize:11,color:"rgba(255,255,255,0.7)",fontWeight:700}}>Rs. {subtotal?.toLocaleString()}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between"}}>
                  <span style={{fontSize:11,color:"rgba(255,255,255,0.4)",fontWeight:500}}>Shipping</span>
                  <span style={{fontSize:11,color:"#22d3ee",fontWeight:700}}>Rs. {DELIVERY_FEE}</span>
                </div>
                <div style={{height:1,background:"rgba(255,255,255,0.06)"}} />
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
                  <span style={{fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.2em",color:"rgba(6,182,212,0.6)"}}>Total</span>
                  <span style={{fontSize:"1.5rem",fontWeight:900,fontFamily:"'Syne',sans-serif",backgroundImage:"linear-gradient(135deg,#22d3ee,#818cf8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>Rs. {total?.toLocaleString()}</span>
                </div>
              </div>
              <div style={{marginTop:20,padding:"14px",background:"rgba(16,185,129,0.07)",border:"1px solid rgba(16,185,129,0.15)",borderRadius:12,display:"flex",alignItems:"center",gap:8}}>
                <ShieldCheck size={14} style={{color:"#34d399",flexShrink:0}} />
                <p style={{fontSize:10,color:"rgba(52,211,153,0.7)",fontWeight:600,margin:0}}>Cash on Delivery — Pay on arrival</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:900px){div[style*="grid-template-columns: 1fr 360px"]{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}