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


// Only vendors can create
router.post(
  "/vendorAddAdvert",
  authMiddlewareHandler,
  authorizedRoles("vendor"),
  upload.single("file"),
  // #swagger.security = [{"bearerAuth": []}],
  createAdvert
);
router.get(
  "/userOnlyViewAdverts/:id",
  authMiddlewareHandler,
  userOnlyViewAdvertById
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
  // #swagger.security = [{"bearerAuth": []}],

  deleteAdvert
);

router.get("/usersviewAlladverts", getAllAdverts);
router.get("/search",searchAdvert);


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


module.exports = router;
