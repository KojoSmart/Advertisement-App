const express = require("express");
const router = express.Router();
const {
  signUp,
  login,
  forgotPassword,
  resetPassword
 
} = require("../controllers/authController");
// const authMiddleware = require("../middlewares/authMiddleware");
const { authMiddlewareHandler } = require("../middlewares/authMiddleware");

router.post("/signup", signUp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// router.get("/profile", authMiddlewareHandler, (req, res) => {
//   res.json({
//     message: "This is a protected route",
//     user: req.user.username,
//   });
// });
// router.get("/profile", authMiddleware, (req, res) => {
//   res.json({
//     message: "This is a protected route",
//     user: req.user,
//   });
// });

module.exports = router;
