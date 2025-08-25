const express = require("express");
const {
  getAllAccounts,
  getAccount,
} = require("../Controllers/accountController");

const router = express.Router();

router.route("/").get(getAllAccounts);
router.route("/:id").get(getAccount);

module.exports = router;
