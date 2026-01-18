const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-ts");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = (webpackConfigEnv, argv) => {
  const orgName = "cortex-bank";
  const defaultConfig = singleSpaDefaults({
    orgName,
    projectName: "root-config",
    webpackConfigEnv,
    argv,
    disableHtmlGeneration: true,
  });
    
  const PORT = 3000;
  const isLocal = webpackConfigEnv && webpackConfigEnv.isLocal;
  const isProduction = !isLocal && (process.env.NODE_ENV === 'production' || process.env.VERCEL);

  const microfrontendUrls = {
    rootConfig: process.env.MF_URL_ROOT_CONFIG || (isLocal ? "//localhost:3000" : ""),
    navigationDrawer: process.env.MF_URL_NAVIGATION_DRAWER || (isLocal ? "//localhost:3001" : ""),
    dashboard: process.env.MF_URL_DASHBOARD || (isLocal ? "//localhost:3002" : ""),
    transactions: process.env.MF_URL_TRANSACTIONS || (isLocal ? "//localhost:3003" : ""),
    statement: process.env.MF_URL_STATEMENT || (isLocal ? "//localhost:3004" : ""),
    auth: process.env.MF_URL_AUTH || (isLocal ? "//localhost:3005" : ""),
  };

  if (isProduction) {
    const requiredEnvVars = [
      'MF_URL_ROOT_CONFIG',
      'MF_URL_NAVIGATION_DRAWER',
      'MF_URL_DASHBOARD',
      'MF_URL_TRANSACTIONS',
      'MF_URL_STATEMENT',
      'MF_URL_AUTH'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      throw new Error(
        `❌ ERRO: Variáveis de ambiente obrigatórias não definidas:\n` +
        `   ${missingVars.join(', ')}\n\n` +
        `📝 Configure essas variáveis de ambiente:\n` +
        `   - Na Vercel: Settings → Environment Variables\n` +
        `   - Ou exporte antes do build: export MF_URL_ROOT_CONFIG=...\n` +
        `   (Selecione: Production, Preview, Development)\n\n` +
        `📚 Veja: docs/vercel_deploy.md ou DEPLOY_QUICK_START.md`
      );
    }

    const emptyUrls = Object.entries(microfrontendUrls)
      .filter(([key, value]) => !value || value.trim() === '')
      .map(([key]) => key);
    
    if (emptyUrls.length > 0) {
      throw new Error(
        `❌ ERRO: URLs dos microfrontends estão vazias:\n` +
        `   ${emptyUrls.join(', ')}\n\n` +
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
          orgName,
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
      watchFiles: ["src//", "public//"],

      client: {
        webSocketURL: {
          protocol: "ws",
          hostname: "localhost",
          port: PORT,
        },
      },
    },

    watchOptions: {
      poll: 1000,
      aggregateTimeout: 300,
      ignored: /node_modules/,
    },

  });
};
