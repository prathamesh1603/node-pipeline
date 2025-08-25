const express = require("express");
const {
  getCompany,
  createCompany,
  getAllCompany,
  editCompany,
  createContactStage,
  updateContactStage,
  deleteContactStage,
  getContactStages,
  updateContactStagesOrder,
  getAllCampaignNames,
  updateCampaignNames,
  getAllDepartmentMiddleware,
  getAllDepartment,
  updateDepartmentMiddleware,
  updateDepartment,
} = require("../Controllers/companyController");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const giveAccess = require("../middlewares/giveAccessTo");
const {
  roleControlDataMiddleware,
} = require("../middlewares/roleControlMiddleware");

const router = express.Router();
router.use(isLoggedIn);
router
  .route("/:id")
  .get(giveAccess("companies", "read"), getCompany)
  .patch(giveAccess("companies", "update"), editCompany);

router
  .route("/")
  .get(
    giveAccess("companies", "read"),
    roleControlDataMiddleware,
    getAllCompany
  )
  .post(giveAccess("companies", "create"), createCompany);

// :module -> can be lead/deal (because we have lead and deal contact stages)
router
  .route("/:module/contact-stage")
  .get(giveAccess("stages", "read"), getContactStages)
  .post(giveAccess("stages", "create"), createContactStage)
  .patch(giveAccess("stages", "update"), updateContactStage)
  .put(giveAccess("stages", "update"), updateContactStagesOrder);
router
  .route("/:module/contact-stage/:id")
  .get(giveAccess("stages", "read"), getContactStages)
  .post(giveAccess("stages", "create"), createContactStage)
  .patch(giveAccess("stages", "update"), updateContactStage)
  .put(giveAccess("stages", "update"), updateContactStagesOrder);

router
  .route("/operation/field/campaign/:id")
  .get(getAllCampaignNames)
  .patch(updateCampaignNames);

router
  .route("/operation/field/departments/:id")
  .get(getAllDepartmentMiddleware, getAllDepartment)
  .patch(updateDepartmentMiddleware, updateDepartment);

module.exports = router;
