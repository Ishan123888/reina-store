import { getSupabaseServerClient } from "@/core/configs/supabase-server";
import { NextRequest, NextResponse } from "next/server";

function generateInvoiceHTML(order: any): string {
  const items = order.items || [];
  const itemsHTML = items
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">Rs. ${item.price.toLocaleString()}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">Rs. ${(item.price * item.quantity).toLocaleString()}</td>
    </tr>
  `
    )
    .join("");

  const subtotal = order.subtotal_amount || 0;
  const shipping = order.shipping_fee || 0;
  const total = order.total_amount || 0;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Invoice - ${order.id}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; background: white; border: 1px solid #e5e7eb; border-radius: 8px; }
        .invoice-header { background: linear-gradient(135deg, #f97316 0%, #fb923c 100%); color: white; padding: 30px; }
        .invoice-header h1 { margin: 0; font-size: 28px; }
        .invoice-meta { font-size: 14px; margin-top: 10px; opacity: 0.9; }
        .invoice-content { padding: 30px; }
        .invoice-row { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
        .invoice-section h3 { margin: 0 0 10px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: 600; letter-spacing: 0.05em; }
        .invoice-section p { margin: 4px 0; font-size: 14px; }
        table { width: 100%; border-collapse: collapse; margin: 30px 0; }
        table th { background: #f3f4f6; padding: 12px; text-align: left; font-weight: 600; font-size: 12px; text-transform: uppercase; color: #6b7280; }
        .invoice-total { text-align: right; margin-top: 30px; border-top: 2px solid #e5e7eb; padding-top: 20px; }
        .total-row { display: grid; grid-template-columns: 200px 1fr; gap: 20px; margin: 10px 0; font-size: 14px; }
        .total-amount { font-size: 24px; font-weight: 700; color: #f97316; margin-top: 15px; }
        .payment-method { background: #f0fdf4; border: 1px solid #dcfce7; border-radius: 6px; padding: 15px; margin-top: 30px; }
        .footer { background: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="invoice-header">
          <h1>REINA STORE</h1>
          <div class="invoice-meta">
            <strong>Invoice #${order.id.substring(0, 8).toUpperCase()}</strong>
            <br>
            Date: ${new Date(order.created_at).toLocaleDateString('en-LK')}
          </div>
        </div>

        <div class="invoice-content">
          <div class="invoice-row">
            <div>
              <h3>Bill To</h3>
              <p><strong>${order.customer_name}</strong></p>
              <p>${order.customer_email}</p>
              <p>${order.phone}</p>
              <p>${order.address}</p>
            </div>
            <div>
              <h3>Order Details</h3>
              <p><strong>Order ID:</strong> ${order.id.substring(0, 8).toUpperCase()}</p>
              <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString('en-LK')}</p>
              <p><strong>Status:</strong> ${order.status}</p>
              <p><strong>Payment:</strong> Cash on Delivery</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>

          <div class="invoice-total">
            <div class="total-row">
              <span>Subtotal</span>
              <span style="text-align: right;">Rs. ${subtotal.toLocaleString()}</span>
            </div>
            <div class="total-row">
              <span>Delivery Charge</span>
              <span style="text-align: right;">Rs. ${shipping.toLocaleString()}</span>
            </div>
            <div class="total-row" style="border-top: 2px solid #e5e7eb; padding-top: 10px; margin-top: 20px; font-weight: 600;">
              <span>Total Amount</span>
              <span style="text-align: right;">Rs. ${total.toLocaleString()}</span>
            </div>
          </div>

          <div class="payment-method">
            <strong>💚 Payment Method: Cash on Delivery</strong>
            <p style="margin: 8px 0 0 0; font-size: 13px;">Please pay Rs. ${total.toLocaleString()} when the package arrives at your address.</p>
          </div>
        </div>

        <div class="footer">
          <p><strong>Reina Ladies Slipper Store</strong><br>Premium Quality Slippers | Islandwide Delivery</p>
          <p>Thank you for your order!</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params;
    const supabase = await getSupabaseServerClient();

    const { data: order, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (error) throw error;
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const html = generateInvoiceHTML(order);

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Error generating invoice:", error);
    return NextResponse.json(
      { error: "Failed to generate invoice" },
      { status: 500 }
    );
  }
}
