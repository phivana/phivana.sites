const path = require("path");

/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ["@phivana/ui", "@phivana/types", "@phivana/db", "@phivana/site-chrome"],
  typedRoutes: true,
  outputFileTracingRoot: path.join(__dirname, "../.."),
  // ...rest of your config
};