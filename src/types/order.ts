export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | (string & {});

export interface SlipperItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image_url: string;
}

export interface ReinaOrder {
  id: string;
  customer_name: string;
  customer_email?: string | null;
  phone: string;
  address: string;
  items: SlipperItem[];
  total_amount: number;
  status: OrderStatus;
  is_cod?: boolean | null;
  created_at: string;
  tracking_number?: string | null;
}

