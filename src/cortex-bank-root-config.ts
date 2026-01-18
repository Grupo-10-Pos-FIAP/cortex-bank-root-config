import { registerApplication, start } from "single-spa";
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from "single-spa-layout";
import microfrontendLayout from "./microfrontend-layout.html";
import { checkAuthAndRedirect } from "./utils/auth";
import { initializeRouteAttributeListeners } from "./utils/route-attribute";

/**
 * Root Config - Orquestrador principal dos microfrontends
 *
 * Responsabilidades:
 * - Verificar autenticação e redirecionar conforme necessário
 * - Construir rotas e aplicações a partir do layout
 * - Registrar e inicializar aplicações Single-SPA
 * - Configurar listeners para atualização de atributos de rota
 */

// Verifica autenticação e redireciona antes de inicializar
checkAuthAndRedirect();

// Constrói rotas a partir do layout HTML
const routes = constructRoutes(microfrontendLayout);

// Constrói aplicações Single-SPA a partir das rotas
const applications = constructApplications({
  routes,
  loadApp({ name }) {
    return import(/* webpackIgnore: true */ name);
  },
});

// Constrói o layout engine para gerenciar o layout
const layoutEngine = constructLayoutEngine({ routes, applications });

// Registra todas as aplicações
applications.forEach(registerApplication);

// Ativa o layout engine
layoutEngine.activate();

// Inicia o Single-SPA
start();

// Inicializa listeners para atualização automática de atributos de rota
initializeRouteAttributeListeners();
