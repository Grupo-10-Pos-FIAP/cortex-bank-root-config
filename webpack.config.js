const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-ts");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

// Constantes
const ORG_NAME = "cortex-bank";
const PROJECT_NAME = "root-config";
const PORT = 3000;
const WATCH_POLL_INTERVAL = 1000;
const WATCH_AGGREGATE_TIMEOUT = 300;

// Portas dos microfrontends
const MF_PORTS = {
  ROOT_CONFIG: 3000,
  NAVIGATION_DRAWER: 3001,
  DASHBOARD: 3002,
  TRANSACTIONS: 3003,
  STATEMENT: 3004,
  AUTH: 3005,
};

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: ORG_NAME,
    projectName: PROJECT_NAME,
    webpackConfigEnv,
    argv,
    disableHtmlGeneration: true,
  });

  const isLocal = webpackConfigEnv && webpackConfigEnv.isLocal;
  const isProduction =
    !isLocal && (process.env.NODE_ENV === "production" || process.env.VERCEL);

  const microfrontendUrls = {
    rootConfig:
      process.env.MF_URL_ROOT_CONFIG ||
      (isLocal ? `//localhost:${MF_PORTS.ROOT_CONFIG}` : ""),
    navigationDrawer:
      process.env.MF_URL_NAVIGATION_DRAWER ||
      (isLocal ? `//localhost:${MF_PORTS.NAVIGATION_DRAWER}` : ""),
    dashboard:
      process.env.MF_URL_DASHBOARD ||
      (isLocal ? `//localhost:${MF_PORTS.DASHBOARD}` : ""),
    transactions:
      process.env.MF_URL_TRANSACTIONS ||
      (isLocal ? `//localhost:${MF_PORTS.TRANSACTIONS}` : ""),
    statement:
      process.env.MF_URL_STATEMENT ||
      (isLocal ? `//localhost:${MF_PORTS.STATEMENT}` : ""),
    auth:
      process.env.MF_URL_AUTH ||
      (isLocal ? `//localhost:${MF_PORTS.AUTH}` : ""),
  };

  if (isProduction) {
    const requiredEnvVars = [
      "MF_URL_ROOT_CONFIG",
      "MF_URL_NAVIGATION_DRAWER",
      "MF_URL_DASHBOARD",
      "MF_URL_TRANSACTIONS",
      "MF_URL_STATEMENT",
      "MF_URL_AUTH",
    ];

    const missingVars = requiredEnvVars.filter(
      (varName) => !process.env[varName]
    );

    if (missingVars.length > 0) {
      throw new Error(
        `❌ ERRO: Variáveis de ambiente obrigatórias não definidas:\n` +
          `   ${missingVars.join(", ")}\n\n` +
          `📝 Configure essas variáveis de ambiente:\n` +
          `   - Na Vercel: Settings → Environment Variables\n` +
          `   - Ou exporte antes do build: export MF_URL_ROOT_CONFIG=...\n` +
          `   (Selecione: Production, Preview, Development)\n\n` +
          `📚 Veja: docs/vercel_deploy.md ou DEPLOY_QUICK_START.md`
      );
    }

    const emptyUrls = Object.entries(microfrontendUrls)
      .filter(([key, value]) => !value || value.trim() === "")
      .map(([key]) => key);

    if (emptyUrls.length > 0) {
      throw new Error(
        `❌ ERRO: URLs dos microfrontends estão vazias:\n` +
          `   ${emptyUrls.join(", ")}\n\n` +
          `📝 Verifique se as variáveis de ambiente estão configuradas corretamente na Vercel.\n` +
          `📚 Veja: docs/vercel_deploy.md ou DEPLOY_QUICK_START.md`
      );
    }
  }

  return merge(defaultConfig, {
    plugins: [
      new webpack.DefinePlugin({
        "process.env.MICROFRONTEND_URLS": JSON.stringify(microfrontendUrls),
      }),
      new HtmlWebpackPlugin({
        inject: false,
        template: "src/index.ejs",
        templateParameters: {
          isLocal,
          orgName: ORG_NAME,
          microfrontendUrls,
        },
      }),
    ],

    devServer: {
      hot: true,
      host: "0.0.0.0",
      port: PORT,
      allowedHosts: "all",
      historyApiFallback: true,
      watchFiles: ["src/**", "public/**"],

      client: {
        webSocketURL: {
          protocol: "ws",
          hostname: "localhost",
          port: PORT,
        },
      },
    },

    watchOptions: {
      poll: WATCH_POLL_INTERVAL,
      aggregateTimeout: WATCH_AGGREGATE_TIMEOUT,
      ignored: /node_modules/,
    },
  });
};
