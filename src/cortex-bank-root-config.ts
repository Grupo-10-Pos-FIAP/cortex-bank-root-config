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

  const protectedRoutes = ["/dashboard", "/transactions", "/statement"];

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
