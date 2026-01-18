/**
 * Utilitário para atualização de atributos de rota
 * Centraliza a lógica de atualização do atributo data-route no body
 */

/**
 * Atualiza o atributo data-route no body do documento
 * com base no pathname atual da URL
 */
export function updateRouteAttribute(): void {
  const pathname = window.location.pathname;
  if (document.body) {
    document.body.setAttribute("data-route", pathname);
  }
}

/**
 * Inicializa os event listeners para atualização automática do atributo de rota
 * Deve ser chamado uma vez na inicialização da aplicação
 */
export function initializeRouteAttributeListeners(): void {
  updateRouteAttribute();

  window.addEventListener("popstate", updateRouteAttribute);
  window.addEventListener("hashchange", updateRouteAttribute);
  window.addEventListener("single-spa:routing-event", updateRouteAttribute);
}
