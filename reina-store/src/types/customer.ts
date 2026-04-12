export type UserRole = "admin" | "customer" | (string & {});

export interface CustomerProfile {
  id: string;
  role: UserRole;
  email?: string | null;
  full_name?: string | null;
  phone?: string | null;
  address?: string | null;
  created_at?: string | null;
}

