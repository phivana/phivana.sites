// apps/000_phivana-sites/next.config.js
const path = require("path");

/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: [
    "@phivana/auth",
    "@phivana/ui",
    "@phivana/types",
    "@phivana/db",
    "@phivana/site-chrome",
    "@phivana/schemas",
    "@phivana/site-builder",
    "@phivana/site-components",
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
