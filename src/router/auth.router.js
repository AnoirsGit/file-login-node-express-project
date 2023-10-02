const Router = require("express");
const router = new Router();
const authController = require('../controller/auth.controller');
const authMiddleware = require('../middleware/auth.middleware')

router.post("/signup", authController.signup);
router.post("/signin", authController.signin);
router.post("/signin/:refresh_token", authController.refreshToken);
router.post("/info", authMiddleware(), authController.info);

module.exports = router;