export type ProductCategory =
  | "Casual"
  | "Formal"
  | "Sport"
  | "Beach"
  | "Home"
  | "Kids"
  | "Ladies"
  | "Gents"
  | (string & {});

export interface Product {
  id: string;
  item_id?: string | null;
  name: string;
  description?: string | null;
  category?: ProductCategory | null;
  price: number;
  image_url?: string | null;
  stock_quantity?: number | null;
  colors?: string[] | null;
  sizes?: string[] | null;
  created_at?: string | null;
}

