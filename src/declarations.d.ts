/**
 * Declarações de módulos TypeScript
 * Define tipos para módulos não-TypeScript importados no projeto
 */

/** Declaração para arquivos HTML importados (usado para microfrontend-layout.html) */
declare module "*.html" {
  const rawHtmlFile: string;
  export = rawHtmlFile;
}
