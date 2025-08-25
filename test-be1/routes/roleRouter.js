const express = require("express");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const giveAccess = require("../middlewares/giveAccessTo");
const {
  createRole,
  getRole,
  updateRole,
  getOne,
  createRoleMiddleware,
  updateRoleMiddleware,
} = require("../Controllers/roleController");
const {
  roleControlDataMiddleware,
} = require("../middlewares/roleControlMiddleware");

const router = express.Router();
router.use(isLoggedIn);

router
  .route("/")
  .get(roleControlDataMiddleware, getRole)
  .post(giveAccess("roles", "create"), createRoleMiddleware, createRole);
router
  .route("/:id")
  .get(getOne)
  .patch(giveAccess("roles", "update"), updateRoleMiddleware, updateRole);

// router.get("/Company",getCompany)
// router.get("/Company/:id",getCompany)
// router.post('/createCompany' , login);
// router.patch('/Company/:id' , signUp);

module.exports = router;
