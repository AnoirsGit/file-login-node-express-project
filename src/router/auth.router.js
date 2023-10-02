const Router = require("express");
const router = new Router();
const authController = require('../controller/auth.controller');


router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/signin/:refresh_token", authController.refreshToken);

module.exports = router;