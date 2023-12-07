const express = require("express");
const router = express.Router();
const multer = require("multer")
const AdminController = require("../controllers/AdminController")
const checkAuth = require("../middlewares/checkauth");
const upload = multer({dest : 'public/files'});
router.post("/signup",AdminController.signup)
router.post("/login",AdminController.login);
router.get("/home",checkAuth,AdminController.getUnverifiedOrganizations);
router.post("/verifyUser/:organizationId",checkAuth,AdminController.verifyOrganization);

module.exports = router;