import express from "express";
import { AuthController } from "../controller/authController.js";
import { validate } from "../common/validate.js";
import { signupSchema, verifyOtpSchema } from "../validations/authValidation.js";
const router = express.Router();

router.post("/signup-with-otp", validate(signupSchema), AuthController.signup);
router.post("/verify-otp", validate(verifyOtpSchema), AuthController.verifyOtp);

export default router;
