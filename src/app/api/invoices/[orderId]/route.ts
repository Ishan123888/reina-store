import { getSupabaseServerClient } from "@/core/configs/supabase-server";
import { NextRequest, NextResponse } from "next/server";

function generateInvoiceHTML(order: any): string {
  const items = order.items || [];
  
  // 1. Calculation Logic Fix (දත්ත database එකේ නැති වුණත් items වලින් ගණනය කරයි)
  const calculatedSubtotal = items.reduce((acc: number, item: any) => acc + ((item.price || 0) * (item.quantity || 1)), 0);
  const shipping = order.shipping_fee || 350; // Shipping නැත්නම් default 350 ක් දැම්මා
  const total = calculatedSubtotal + shipping;

  const itemsHTML = items.map((item: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">Rs. ${(item.price || 0).toLocaleString()}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">Rs. ${((item.price || 0) * (item.quantity || 1)).toLocaleString()}</td>
    </tr>
  `).join("");

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: sans-serif; padding: 40px; color: #333; }
        .container { max-width: 800px; margin: auto; border: 1px solid #eee; padding: 30px; border-radius: 10px; }
        .header { display: flex; justify-content: space-between; border-bottom: 2px solid #f97316; padding-bottom: 20px; }
        .logo { font-size: 28px; font-weight: 900; color: #f97316; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin: 30px 0; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #f8fafc; padding: 12px; text-align: left; border-bottom: 2px solid #eee; font-size: 12px; }
        td { padding: 12px; border-bottom: 1px solid #eee; font-size: 14px; }
        .totals { text-align: right; margin-top: 20px; }
        .total-row { margin: 5px 0; font-size: 14px; }
        .grand-total { font-size: 22px; font-weight: 900; color: #f97316; margin-top: 10px; }
        @media print { .no-print { display: none; } }
      </style>
    </head>
    <body>
      <div class="no-print" style="text-align:center; margin-bottom: 20px;">
        <button onclick="window.print()" style="padding: 10px 20px; background: #f97316; color: white; border: none; border-radius: 5px; cursor: pointer;">Download PDF / Print</button>
      </div>
      <div class="container">
        <div class="header">
          <div class="logo">REINA STORE</div>
          <div style="text-align: right;">
            <p style="margin:0; font-weight:bold;">INVOICE #${order.id.substring(0, 8).toUpperCase()}</p>
            <p style="margin:0; font-size:12px;">Date: ${new Date(order.created_at).toLocaleDateString('en-LK')}</p>
          </div>
        </div>
        <div class="grid">
          <div>
            <h4 style="margin-bottom:10px; color: #666;">BILL TO</h4>
            <p style="margin:2px 0;"><strong>${order.customer_name}</strong></p>
            <p style="margin:2px 0; font-size:13px;">${order.address}</p>
            <p style="margin:2px 0; font-size:13px;">${order.phone}</p>
          </div>
          <div style="text-align: right;">
            <h4 style="margin-bottom:10px; color: #666;">PAYMENT METHOD</h4>
            <p style="margin:2px 0;">Cash on Delivery</p>
            <p style="margin:2px 0; font-size:13px; color: green; font-weight:bold;">Status: ${order.status}</p>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align:center;">Qty</th>
              <th style="text-align:right;">Unit Price</th>
              <th style="text-align:right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>
        <div class="totals">
          <div class="total-row">Subtotal: <strong>Rs. ${calculatedSubtotal.toLocaleString()}</strong></div>
          <div class="total-row">Delivery: <strong>Rs. ${shipping.toLocaleString()}</strong></div>
          <div class="grand-total">TOTAL: Rs. ${total.toLocaleString()}</div>
        </div>
        <div style="margin-top: 40px; padding: 15px; background: #fff7ed; border-radius: 5px; font-size: 13px;">
          <strong>Note:</strong> Please pay the total amount to the courier agent upon delivery.
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ orderId: string }> }) {
  try {
    const { orderId } = await params;
    const supabase = await getSupabaseServerClient();
    
    const { data: order, error } = await supabase.from("orders").select("*").eq("id", orderId).single();
    if (error || !order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const html = generateInvoiceHTML(order);

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
        // මෙමගින් පේජ් එක load වූ සැනින් Print dialog එක open කර PDF ලෙස save කිරීමට ඉඩ දෙයි
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}