const express = require("express");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const { callCustomerByAgentId } = require("../Controllers/ozonetelController");

const Router = express.Router();

Router.use(isLoggedIn);

Router.route("/agentManualDial").post(callCustomerByAgentId);

module.exports = Router;
