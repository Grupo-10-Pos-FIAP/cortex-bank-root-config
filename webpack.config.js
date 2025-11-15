const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-ts");
const HtmlWebpackPlugin = require("html-webpack-plugin");

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

  return merge(defaultConfig, {
    // modify the webpack config however you'd like to by adding to this object
    plugins: [
      new HtmlWebpackPlugin({
        inject: false,
        template: "src/index.ejs",
        templateParameters: {
          isLocal: webpackConfigEnv && webpackConfigEnv.isLocal,
          orgName,
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
