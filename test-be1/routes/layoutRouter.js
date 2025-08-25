const express = require("express");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const {
  createLayout,
  getOneLayout,
  updateLayout,
  getAllLayout,
  updateLayoutMiddleware,
  createLayoutMiddleware,
} = require("../Controllers/layoutController");
const giveAccess = require("../middlewares/giveAccessTo");
const {
  roleControlDataMiddleware,
} = require("../middlewares/roleControlMiddleware");

const Router = express.Router();

Router.use(isLoggedIn);

Router.route("/")
  .get(
    giveAccess("customModules", "read"),
    roleControlDataMiddleware,
    getAllLayout
  )
  .post(
    giveAccess("customModules", "create"),
    createLayoutMiddleware,
    createLayout
  );
Router.route("/:id")
  .get(getOneLayout)
  .patch(updateLayoutMiddleware, updateLayout);

module.exports = Router;
