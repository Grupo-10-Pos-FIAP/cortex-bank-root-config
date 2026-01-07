import { registerApplication, start } from "single-spa";
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from "single-spa-layout";
import microfrontendLayout from "./microfrontend-layout.html";

function checkAuthAndRedirect() {
  const token = localStorage.getItem("token");
  const currentPath = window.location.pathname;

  const protectedRoutes = ["/","/dashboard", "/transactions", "/statement"];

  if (token && (currentPath === "/" || currentPath === "/auth")) {
    window.location.href = "/dashboard";
    return;
  }

  if (!token && protectedRoutes.includes(currentPath)) {
    window.location.href = "/auth";
    return;
  }
}

checkAuthAndRedirect();

const routes = constructRoutes(microfrontendLayout);
const applications = constructApplications({
  routes,
  loadApp({ name }) {
    return import(/* webpackIgnore: true */ name);
  },
});
const layoutEngine = constructLayoutEngine({ routes, applications });

applications.forEach(registerApplication);
layoutEngine.activate();
start();

// Atualiza o atributo data-route no body quando a rota muda
function updateRouteAttribute() {
  const pathname = window.location.pathname;
  if (document.body) {
    document.body.setAttribute('data-route', pathname);
  }
}

// Atualiza quando a rota muda
window.addEventListener('popstate', updateRouteAttribute);
window.addEventListener('hashchange', updateRouteAttribute);

// Atualiza após o single-spa iniciar
setTimeout(updateRouteAttribute, 0);
