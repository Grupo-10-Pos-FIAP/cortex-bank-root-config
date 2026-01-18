/**
 * Configuração de rotas do sistema
 * Define rotas protegidas e públicas
 */

/** Rotas que requerem autenticação */
export const PROTECTED_ROUTES = [
  "/",
  "/dashboard",
  "/transactions",
  "/statement",
] as const;

/** Rotas públicas (não requerem autenticação) */
export const PUBLIC_ROUTES = ["/auth"] as const;

/** Tipo para rotas protegidas */
export type ProtectedRoute = (typeof PROTECTED_ROUTES)[number];

/** Tipo para rotas públicas */
export type PublicRoute = (typeof PUBLIC_ROUTES)[number];

/** Tipo para todas as rotas */
export type AppRoute = ProtectedRoute | PublicRoute;

/** Verifica se uma rota é protegida */
export function isProtectedRoute(path: string): boolean {
  return PROTECTED_ROUTES.includes(path as ProtectedRoute);
}

/** Verifica se uma rota é pública */
export function isPublicRoute(path: string): boolean {
  return PUBLIC_ROUTES.includes(path as PublicRoute);
}
