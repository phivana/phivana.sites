// apps/renderer/next.config.js
const path = require("path");

/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: [
    "@phivana/ui",
    "@phivana/site-builder",
    "@phivana/site-components",
    "@phivana/schemas",
    "@phivana/brand",
    "@phivana/types",
  ],
  outputFileTracingRoot: path.join(__dirname, "../.."),
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      react$: require.resolve("react"),
      "react-dom$": require.resolve("react-dom"),
    };
    config.resolve.symlinks = true;
    return config;
  },
};
