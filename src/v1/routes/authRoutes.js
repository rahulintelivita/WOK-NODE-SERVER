import express from "express";
import { AuthController } from "../controller/authController.js";
import { validate } from "../common/validate.js";
import { signupSchema, verifyOtpSchema, loginSchema, resendOtpSchema, forgotPasswordSchema, verifyResetOtpSchema, resetPasswordSchema, changePasswordSchema } from "../validations/authValidation.js";
import { authMiddleware } from "../middlewares/auth.js";
const router = express.Router();

router.post("/signup-with-otp", validate(signupSchema), AuthController.signup);
router.post("/verify-otp", validate(verifyOtpSchema), AuthController.verifyOtp);
router.post("/login", validate(loginSchema), AuthController.login);
router.post("/resend-otp", validate(resendOtpSchema), AuthController.resendOtp);
router.post("/forgot-password", validate(forgotPasswordSchema), AuthController.forgotPassword);
router.post("/verify-reset-otp", validate(verifyResetOtpSchema), AuthController.verifyResetOtp);
router.post("/reset-password", validate(resetPasswordSchema), AuthController.resetPassword);
router.post("/change-password", authMiddleware, validate(changePasswordSchema), AuthController.changePassword);

export default router;
