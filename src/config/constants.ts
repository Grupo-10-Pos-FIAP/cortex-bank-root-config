/**
 * Constantes centralizadas do root-config
 * Centraliza todas as constantes mágicas do projeto
 */

/** Porta padrão do root-config */
export const ROOT_CONFIG_PORT = 3000;

/** Portas dos microfrontends em desenvolvimento local */
export const MICROFRONTEND_PORTS = {
  ROOT_CONFIG: 3000,
  NAVIGATION_DRAWER: 3001,
  DASHBOARD: 3002,
  TRANSACTIONS: 3003,
  STATEMENT: 3004,
  AUTH: 3005,
} as const;

/** URLs base dos microfrontends em desenvolvimento local */
export const LOCAL_MICROFRONTEND_URLS = {
  ROOT_CONFIG: `//localhost:${MICROFRONTEND_PORTS.ROOT_CONFIG}`,
  NAVIGATION_DRAWER: `//localhost:${MICROFRONTEND_PORTS.NAVIGATION_DRAWER}`,
  DASHBOARD: `//localhost:${MICROFRONTEND_PORTS.DASHBOARD}`,
  TRANSACTIONS: `//localhost:${MICROFRONTEND_PORTS.TRANSACTIONS}`,
  STATEMENT: `//localhost:${MICROFRONTEND_PORTS.STATEMENT}`,
  AUTH: `//localhost:${MICROFRONTEND_PORTS.AUTH}`,
} as const;

/** URLs de CDN para dependências compartilhadas */
export const CDN_URLS = {
  SINGLE_SPA:
    "https://cdn.jsdelivr.net/npm/single-spa@6.0.3/lib/es2015/esm/single-spa.min.js",
  REACT: "https://esm.sh/react@19.2.0?dev",
  REACT_DOM: "https://esm.sh/react-dom@19.2.0?dev",
  REACT_DOM_CLIENT: "https://esm.sh/react-dom@19.2.0/client?dev",
  IMPORT_MAP_OVERRIDES:
    "https://cdn.jsdelivr.net/npm/import-map-overrides@5.1.1/dist/import-map-overrides.js",
  IMPORT_MAP_INJECTOR:
    "https://cdn.jsdelivr.net/npm/@single-spa/import-map-injector@2.0.1/lib/import-map-injector.js",
  NORMALIZE_CSS:
    "https://cdn.jsdelivr.net/npm/normalize.css@8.0.1/normalize.css",
  ROBOTO_FONT:
    "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap",
} as const;

/** Timeouts e delays */
export const TIMEOUTS = {
  SIDEBAR_CLOSE_DELAY: 100,
  ROUTE_ATTRIBUTE_UPDATE_DELAY: 0,
  WATCH_POLL_INTERVAL: 1000,
  WATCH_AGGREGATE_TIMEOUT: 300,
} as const;

/** Nome da organização */
export const ORG_NAME = "cortex-bank";

/** Nome do projeto */
export const PROJECT_NAME = "root-config";

/** Chave do token de autenticação no localStorage */
export const AUTH_TOKEN_KEY = "token";
