import type { UserRole } from "@/types/customer";

export const ADMIN_EMAIL = "ishandilhara57@gmail.com";

export const ADMIN_PREFIXES = ["/dashboard", "/add-product", "/orders", "/customers"];
export const CUSTOMER_ONLY_PREFIXES = ["/customer-dashboard"];
export const AUTH_REQUIRED_PREFIXES = [
  "/collections",
  "/product",
  "/cart",
  "/checkout",
  "/track-order",
  "/order-success",
];

export function normalizeEmail(email?: string | null) {
  return email?.trim().toLowerCase() ?? "";
}

export function isAdminEmail(email?: string | null) {
  return normalizeEmail(email) === ADMIN_EMAIL;
}

export function resolveUserRole(role?: string | null, email?: string | null): UserRole {
  if (isAdminEmail(email) || role === "admin") {
    return "admin";
  }

  return "customer";
}

export function getDashboardPath(role: UserRole) {
  return role === "admin" ? "/dashboard" : "/customer-dashboard";
}

export function matchesPrefix(pathname: string, prefixes: string[]) {
  return prefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

export function canRoleAccessPath(role: UserRole, pathname: string) {
  if (role === "admin") {
    return !matchesPrefix(pathname, CUSTOMER_ONLY_PREFIXES) &&
      !matchesPrefix(pathname, AUTH_REQUIRED_PREFIXES);
  }

  return !matchesPrefix(pathname, ADMIN_PREFIXES);
}

export function getSafePostLoginPath(role: UserRole, nextPath?: string | null) {
  if (nextPath && nextPath.startsWith("/") && canRoleAccessPath(role, nextPath)) {
    return nextPath;
  }

  return getDashboardPath(role);
}
