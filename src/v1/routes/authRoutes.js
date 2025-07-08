import express from "express";
import { AuthController } from "../controller/authController.js";
import { validate } from "../common/validate.js";
import { signupSchema } from "../validations/authValidation.js";
const router = express.Router();

router.post("/signup-with-otp", validate(signupSchema), AuthController.signup);

export default router;
