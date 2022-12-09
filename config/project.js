const NODE_ENV = process.env.NODE_ENV || "development";
const BUILD_ENV = process.env.BUILD_ENV || "production";

const isDev = NODE_ENV === "development";
const isProd = NODE_ENV === "production";

const ENV = {
  NODE_ENV,
  BUILD_ENV,
  isDev,
  isProd,
};

module.exports = { ENV };
