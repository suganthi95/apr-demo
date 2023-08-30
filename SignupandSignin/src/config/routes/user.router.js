const { Router } = require('express');
const controller = require("../controllers/user.controller.js");
const {authMiddeleware} = require("../middlewares/authmiddleware.js")

const router = Router();

router.post("/signup", controller.userSignup);
router.get("/signin", controller.userLogin)
router.get("/access/token", controller.generateToken);
//router.get("/auth", authMiddeleware, controller.test);
router.post("/verify/otp", controller.verifyOtp);
router.post("/resend/otp", controller.resendOtp)


module.exports = router;