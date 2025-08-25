const express = require("express");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const giveAccess = require("../middlewares/giveAccessTo");
const {
  createUser,
  createUserMiddleware,
  getAllUser,
  resetPasswordMiddleware,
  resetPassword,
  updateUserMiddleware,
  updateUser,
  getUserById,
} = require("../Controllers/userController");
const {
  roleControlDataMiddleware,
} = require("../middlewares/roleControlMiddleware");

const router = express.Router();

router.use(isLoggedIn);
router
  .route("/")
  .get(giveAccess("users", "read"), roleControlDataMiddleware, getAllUser)
  .post(createUserMiddleware, createUser);
router.route("/:id").get(getUserById);
router
  .route("/changes/:id")
  .patch(giveAccess("users", "update"), updateUserMiddleware, updateUser);
router.route("/reset-password").patch(resetPasswordMiddleware, resetPassword);
router.route("/change-password").patch(resetPasswordMiddleware, resetPassword);
// router.route("/",)

module.exports = router;
