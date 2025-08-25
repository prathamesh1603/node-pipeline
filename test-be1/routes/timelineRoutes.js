const express = require("express");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const { getTimelineById } = require("../Controllers/timelineController");

const Router = express.Router();

Router.use(isLoggedIn);

Router.route("/:id").get(getTimelineById);

module.exports = Router;
