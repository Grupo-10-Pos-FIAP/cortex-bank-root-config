/**
 * Utilitários de autenticação
 * Gerencia lógica de autenticação e redirecionamento
 */

import { AUTH_TOKEN_KEY } from "../config/constants";
import { isProtectedRoute } from "../config/routes";

/**
 * Verifica autenticação e redireciona conforme necessário
 *
 * Regras:
 * - Se usuário está autenticado e está em "/" ou "/auth" → redireciona para "/dashboard"
 * - Se usuário não está autenticado e está em rota protegida → redireciona para "/auth"
 */
export function checkAuthAndRedirect(): void {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  const currentPath = window.location.pathname;

  // Se autenticado e está na raiz ou na página de auth, redireciona para dashboard
  if (token && (currentPath === "/" || currentPath === "/auth")) {
    window.location.href = "/dashboard";
    return;
  }

  // Se não autenticado e está em rota protegida, redireciona para auth
  if (!token && isProtectedRoute(currentPath)) {
    window.location.href = "/auth";
    return;
  }
}
