const express = require("express");
const {
  createProductMiddleware,
  createProduct,
  updateProduct,
  getAllProduct,
  updateProductMiddleware,
  getProductById,
} = require("../Controllers/productController");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const giveAccess = require("../middlewares/giveAccessTo");
const {
  roleControlDataMiddleware,
} = require("../middlewares/roleControlMiddleware");

const Router = express.Router();

Router.use(isLoggedIn);
Router.route("/")
  .get(giveAccess("products", "read"), roleControlDataMiddleware, getAllProduct)
  .post(
    giveAccess("products", "create"),
    createProductMiddleware,
    createProduct
  );

Router.route("/:id")
  .get(getProductById)
  .patch(
    giveAccess("products", "update"),
    updateProductMiddleware,
    updateProduct
  );

module.exports = Router;
