const express = require("express");
const router = express.Router();

const {
  createAdvert,
  searchAdvert,
  updateAdvert,
  deleteAdvert,
  getAllAdverts,
  oneAdvert,
  userOnlyViewAdvert
} = require("../controllers/advertController");
const upload = require("../middlewares/uploadMulter");
const {
  authorizedRoles,
  authMiddlewareHandler,
} = require("../middlewares/authMiddleware");
const x = require("../middlewares/authMiddleware");
console.log(typeof x);

// Only vendors can create

router.post(
  "/vendorAddAdvert",
  authMiddlewareHandler,
  authorizedRoles("vendor"),
  upload.single("image"),
  // #swagger.security = [{"bearerAuth": []}],

  createAdvert
);

router.put(
  "/vendorUpdateAdvert/:id",
  authMiddlewareHandler,
  authorizedRoles("vendor"),
  upload.single("file"),
  // #swagger.security = [{"bearerAuth": []}],

  updateAdvert
);
router.delete(
  "/vendorDeleteAdvert/:id",
  authMiddlewareHandler,
  authorizedRoles("vendor"),
  deleteAdvert
);
router.get(
  "/usersviewAlladverts",
  authMiddlewareHandler,
  authorizedRoles("user"),
  // #swagger.security = [{"bearerAuth": []}],

  getAllAdverts
);
router.get(
  "/vendorAdverts/:id",
  authMiddlewareHandler,
  authorizedRoles("vendor"),
  // #swagger.security = [{"bearerAuth": [] }],

  oneAdvert
);

router.get(
  "/userOnlyViewAdverts/:id",
  authMiddlewareHandler,
  authorizedRoles("user"),
  // #swagger.security = [{"bearerAuth": []}]
  userOnlyViewAdvert
);
//  GET single advert by ID
//router.get("/adverts/:id", getAdvertById);

// Testing purpose
// router.get(
//   "/pro",
//   authMiddlewareHandler,
//   authorizedRoles("user"),
//   (req, res) => {
//     res.json({
//       message: "This is a protected route",
//       user: req.user.username,
//     });
//   }
// );
module.exports = router;
