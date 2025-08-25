const express = require("express");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const giveAccess = require("../middlewares/giveAccessTo");
const {
  roleControlDataMiddleware,
} = require("../middlewares/roleControlMiddleware");
const {
  getAllDeal,
  getDeal,
  updateDealMiddleware,
  updateDeal,
} = require("../Controllers/dealController");

const router = express.Router();

router.use(isLoggedIn);
router
  .route("/")
  .get(giveAccess("deals", "read"), roleControlDataMiddleware, getAllDeal);
router
  .route("/:id")
  .get(giveAccess("deals", "read"), getDeal)
  .patch(updateDealMiddleware, updateDeal);

module.exports = router;
