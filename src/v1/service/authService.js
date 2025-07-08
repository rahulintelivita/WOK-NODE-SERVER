import bcrypt from "bcryptjs";
import { MESSAGE } from "../common/constants.js";
import { ResponseHandler } from "../common/responseHendler.js";
import { prisma } from "../config/db.js";
import { env } from "../config/env.config.js";
import { sendOtpEmail } from "../common/email.js";
import { OtpService } from "./otpService.js";

export const AuthService = {
     async signup({ full_name, email, password, profile_url }, res) {
          try {
               // Check if user already exists
               const existingUser = await prisma.user.findUnique({
                    where: { email }
               });
               if (existingUser) {
                    return ResponseHandler.error(res, {
                         message: MESSAGE.ALREADY_EXISTS("User")
                    });
               }
               const salt = await bcrypt.genSalt(Number(env.BCRYPT_SALT_ROUND));
               const hashedPassword = await bcrypt.hash(password, salt);
               // Create user
               const user = await prisma.user.create({
                    data: {
                         full_name,
                         email,
                         password: hashedPassword,
                         profile_url
                    }
               });
               // Generate OTP and send email
               const otpRecord = await OtpService.generateOtp({
                    userId: user.id,
                    type: 1
               }); // 1 = email_verification

               const emailResult = await sendOtpEmail({
                    to: email,
                    name: full_name,
                    otp: otpRecord.otp,
                    otp_expiry: env.OTP_EXPIRES_MINUTES
               });

               // Check if email sending failed
               if (emailResult.success === 0) {
                    return ResponseHandler.error(res, {
                         message: "User created but failed to send OTP email",
                         errors: { email: emailResult.message }
                    });
               }
          } catch (error) {
               throw error;
          }
     }
};
