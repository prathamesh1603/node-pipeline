const express = require("express");
const {
  login,
  signUp,
  logout,
  verifyUser,
} = require("../Controllers/authController");

const router = express.Router();

router.post("/login", login);
router.post("/verify-user", verifyUser);
router.post("/signup", signUp);
router.post("/logout", logout);

module.exports = router;
