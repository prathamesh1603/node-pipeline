const buildProdLogger = require("./prodLogger");
const buildDevLogger = require("./devLogger");
let logger = null;

if (process.env.NODE_ENV === "production") {
  logger = buildProdLogger();
} else {
  logger = buildDevLogger();
}

module.exports = logger;
