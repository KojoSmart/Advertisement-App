const express = require("express");
const router = express.Router();

const {
  createAdvert,
  searchAdvert,
  updateAdvert,
  deleteAdvert,
  getAllAdverts,
  oneAdvert,
  userOnlyViewAdvertById,
  getAllAdvertsByVendor,
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
router.get("/userOnlyViewAdverts/:id", userOnlyViewAdvertById);

router.put(
  "/vendorUpdateAdvert/:id",
  authMiddlewareHandler,
  authorizedRoles("vendor"),
  upload.single("image"),
  // #swagger.security = [{"bearerAuth": []}],
   updateAdvert
);
router.delete(
  "/vendorDeleteAdvert/:id",
  authMiddlewareHandler,
  authorizedRoles("vendor"),
  // #swagger.security = [{"bearerAuth": []}],

  deleteAdvert
);

router.get(
  "/userSearchItem/:search",
  authMiddlewareHandler,
  authorizedRoles("users"),
  //#swagger.security = [{"bearerAuth": []}],
  searchAdvert
);
router.get(
  "/usersviewAlladverts",
 
  getAllAdverts
);

router.get(
  "/allAdvertsByVendor",
  authMiddlewareHandler,
  authorizedRoles("vendor"),
  // #swagger.security = [{"bearerAuth": []}],
  getAllAdvertsByVendor
);
router.get(
  "/vendorAdverts/:id",
  authMiddlewareHandler,
  authorizedRoles("vendor"),
  // #swagger.security = [{"bearerAuth": [] }],

  oneAdvert
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
