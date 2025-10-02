const path = require("path");

/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ["@phivana/auth", "@phivana/ui", "@phivana/types", "@phivana/db", "@phivana/site-chrome", "@phivana/schemas", "@phivana/site-builder", "@phivana/site-components"],
  typedRoutes: true,
  outputFileTracingRoot: path.join(__dirname, "../.."),
  // ...rest of your config
};