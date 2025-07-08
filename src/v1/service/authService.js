import bcrypt from "bcryptjs";
import { HTTP_STATUS_CODES, MESSAGE } from "../common/constants.js";
import { ResponseHandler } from "../common/responseHendler.js";
import { prisma } from "../config/db.js";
import { env } from "../config/env.config.js";
import { sendOtpEmail } from "../common/email.js";
import { OtpService } from "./otpService.js";

export const AuthService = {
     async signup({ full_name, email, password, profile_url }) {
          // Check if user already exists
          const existingUser = await prisma.user.findUnique({
               where: { email }
          });

          if (existingUser) {
               if (existingUser.status === 0) {
                    // User is pending verification, update OTP
                    // Invalidate previous OTPs
                    await prisma.otp.updateMany({
                         where: {
                              user_id: existingUser.id,
                              type: 1,
                              verified: false
                         },
                         data: { verified: true }
                    });
                    // Generate new OTP
                    const otpRecord = await OtpService.generateOtp({
                         userId: existingUser.id,
                         type: 1
                    });
                    // Send OTP email
                    await sendOtpEmail({
                         to: email,
                         name: existingUser.full_name,
                         otp: otpRecord.otp,
                         otp_expiry: env.OTP_EXPIRES_MINUTES
                    });
               } else {
                    // User is already verified
                    const error = new Error(MESSAGE.ALREADY_EXISTS("User"));
                    error.statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
                    throw error;
               }
          }

          // If user does not exist, create new user
          const salt = await bcrypt.genSalt(Number(env.BCRYPT_SALT_ROUND));
          const hashedPassword = await bcrypt.hash(password, salt);
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
          });
          await sendOtpEmail({
               to: email,
               name: full_name,
               otp: otpRecord.otp,
               otp_expiry: env.OTP_EXPIRES_MINUTES
          });
     }
};
