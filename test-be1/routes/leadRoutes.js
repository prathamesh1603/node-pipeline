const express = require("express");
const {
  createLead,
  getLeads,
  updateLead,
  getLeadById,
  getAllLeadMiddleware,
  getAllLead,
  getLead,
  updateLeadMiddleware,
  convertToDealMiddleware,
  serveLeadForm,
  createLeadExternalWebForm,
  distrbuteBulkLead,
} = require("../Controllers/leadController");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const giveAccess = require("../middlewares/giveAccessTo");
const {
  roleControlDataMiddleware,
} = require("../middlewares/roleControlMiddleware");

const router = express.Router();

router
  .route("/leadform/form")
  .get(serveLeadForm)
  .post(createLeadExternalWebForm);
router.use(isLoggedIn);
router
  .route("/")
  .get(giveAccess("leads", "read"), roleControlDataMiddleware, getAllLead)
  .post(giveAccess("leads", "create"), createLead);
router
  .route("/:id")
  .get(getLead)
  .patch(
    giveAccess("leads", "update"),
    updateLeadMiddleware,
    convertToDealMiddleware,
    updateLead
  );
router.patch(
  "/operation/bulk-lead-assignment",
  giveAccess("leads", "update"),
  distrbuteBulkLead
);
//router.delete("/deletelead/:id", deleteLead);

module.exports = router;
