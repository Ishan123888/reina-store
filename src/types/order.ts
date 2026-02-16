// Order එකක තිබිය හැකි අවස්ථා (Status)
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

// සෙරෙප්පු අයිතමයක (Slipper Item) ව්‍යුහය
export interface SlipperItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color?: string; // Optional - අවශ්‍ය නම් පමණක් පාවිච්චි කළ හැක
  image_url: string;
}

// සම්පූර්ණ Order එකක ව්‍යුහය (Reina Order Interface)
export interface ReinaOrder {
  id: string;
  customer_name: string;
  customer_email: string;
  phone: string;
  address: string;
  items: SlipperItem[]; // මෙතැන 'any[]' වෙනුවට 'SlipperItem[]' යෙදීමෙන් error එක විසඳේ
  total_amount: number;
  status: OrderStatus;
  is_cod: boolean;
  created_at: string;
  tracking_number?: string;
}