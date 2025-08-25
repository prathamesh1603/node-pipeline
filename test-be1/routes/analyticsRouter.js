const express = require("express");
const {
  getLeadAnlytics,
  dynamicPopulateMiddleware,
  userPopulateMiddleware,
  getDealAnalytics,
  getProductAnaltics,
  getUserAnalytics,
} = require("../Controllers/analyticsController");
const { isLoggedIn } = require("../middlewares/isLoggedIn");

const router = express.Router();
router.use(isLoggedIn, userPopulateMiddleware);
router.get("/lead", dynamicPopulateMiddleware, getLeadAnlytics);
router.get("/deal", dynamicPopulateMiddleware, getDealAnalytics);
router.get("/product", dynamicPopulateMiddleware, getProductAnaltics);
router.get("/user", dynamicPopulateMiddleware, getUserAnalytics);

module.exports = router;
