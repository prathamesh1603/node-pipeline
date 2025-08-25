const express = require("express");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const {
  downlodeLeadReport,
  downlodeDealReport,
  downlodeProductReport,
  importBulkLeads,
  uploadFileMiddleware,
} = require("../Controllers/fileExportController");

const router = express.Router();
router.use(isLoggedIn);
router.get("/downlode-lead-report", downlodeLeadReport);
router.get("/downlode-deal-report", downlodeDealReport);
router.get("/downlode-product-report", downlodeProductReport);

router.post("/bulk-lead-upload", uploadFileMiddleware, importBulkLeads);

module.exports = router;
