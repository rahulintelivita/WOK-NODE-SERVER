import bcrypt from "bcryptjs";
import { HTTP_STATUS_CODES, MESSAGE } from "../common/constants.js";
import { prisma } from "../config/db.js";
import { env } from "../config/env.config.js";
import { sendOtpEmail, sendPasswordResetOtpEmail } from "../common/email.js";
import { OtpService } from "./otpService.js";
import { TokenService } from "./tokenService.js";
import moment from "moment";

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
                              type: 1, //  email_verification
                              verified: false
                         },
                         data: { verified: true, deleted_at: moment().unix() }
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
                    return; // Prevent further execution and duplicate user creation
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
                    profile_url,
                    created_at: moment().unix()
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
     },

     async verifyOtp({ email, otp }) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            const error = new Error(MESSAGE.RECORD_NOT_FOUND("User"));
            error.statusCode = HTTP_STATUS_CODES.NOT_FOUND;
            throw error;
        }
        const otpRecord = await prisma.otp.findFirst({
            where: {
                user_id: user.id,
                otp,
                type: 1,
                verified: false,
                expires_at: { gt: new Date() }
            }
        });
        if (!otpRecord) {
            const error = new Error(MESSAGE.INVALID_OTP);
            error.statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
            throw error;
        }
        // Mark OTP as verified
        await prisma.otp.update({
            where: { id: otpRecord.id },
            data: { verified: true }
        });
        // Update user status to verified
        await prisma.user.update({
            where: { id: user.id },
            data: { status: 1 }
        });
    },

    async login({ email, password }) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            const error = new Error(MESSAGE.RECORD_NOT_FOUND("User"));
            error.statusCode = HTTP_STATUS_CODES.NOT_FOUND;
            throw error;
        }
        if (user.status !== 1) {
            const error = new Error("User is not verified. Please verify your email first.");
            error.statusCode = HTTP_STATUS_CODES.UNAUTHORIZED;
            throw error;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const error = new Error("Invalid email or password");
            error.statusCode = HTTP_STATUS_CODES.UNAUTHORIZED;
            throw error;
        }
        // Create and return token
        const tokenRecord = await TokenService.createToken({ userId: user.id });
        return {
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                profile_url: user.profile_url,
                status: user.status,
                access_token: tokenRecord.access_token
            }
        };
    },

    async resendOtp({ email }) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            const error = new Error(MESSAGE.RECORD_NOT_FOUND("User"));
            error.statusCode = HTTP_STATUS_CODES.NOT_FOUND;
            throw error;
        }
        if (user.status === 1) {
            const error = new Error(MESSAGE.USER_IS_ALREADY_VERIFIED);
            error.statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
            throw error;
        }
        // Invalidate previous OTPs
        await prisma.otp.updateMany({
            where: { user_id: user.id, type: 1, verified: false },
            data: { verified: true }
        });
        // Generate new OTP
        const otpRecord = await OtpService.generateOtp({
            userId: user.id,
            type: 1
        });
        // Send OTP email
        await sendOtpEmail({
            to: email,
            name: user.full_name,
            otp: otpRecord.otp,
            otp_expiry: env.OTP_EXPIRES_MINUTES
        });
    },

    async forgotPassword({ email }) {
        // Always respond with success for security
        const user = await prisma.user.findUnique({ where: { email } });
        if (user && user.status === 1) {
            // Invalidate previous password reset OTPs
            await prisma.otp.updateMany({
                where: { user_id: user.id, type: 2, verified: false },
                data: { verified: true, deleted_at: moment().unix() }
            });
            // Generate new OTP
            const otpRecord = await OtpService.generateOtp({
                userId: user.id,
                type: 2 // password_reset
            });
            // Send password reset OTP email
            await sendPasswordResetOtpEmail({
                to: email,
                name: user.full_name,
                otp: otpRecord.otp,
                otp_expiry: env.OTP_EXPIRES_MINUTES
            });
        }
        return 
    },

    async verifyResetOtp({ email, otp }) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            const error = new Error(MESSAGE.RECORD_NOT_FOUND("User"));
            error.statusCode = HTTP_STATUS_CODES.NOT_FOUND;
            throw error;
        }
        const otpRecord = await prisma.otp.findFirst({
            where: {
                user_id: user.id,
                otp,
                type: 2,
                verified: false,
                expires_at: { gt: new Date() }
            }
        });
        if (!otpRecord) {
            const error = new Error(MESSAGE.INVALID_OTP);
            error.statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
            throw error;
        }
        // Mark OTP as verified
        await prisma.otp.update({
            where: { id: otpRecord.id },
            data: { verified: true }
        });
        return { verified: true };
    },

    async resetPassword({ email, otp, new_password }) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            const error = new Error(MESSAGE.RECORD_NOT_FOUND("User"));
            error.statusCode = HTTP_STATUS_CODES.NOT_FOUND;
            throw error;
        }
        const otpRecord = await prisma.otp.findFirst({
            where: {
                user_id: user.id,
                otp,
                type: 2,
                verified: true,
                expires_at: { gt: new Date() }
            }
        });
        if (!otpRecord) {
            const error = new Error(MESSAGE.INVALID_OTP);
            error.statusCode = HTTP_STATUS_CODES.BAD_REQUEST;
            throw error;
        }
        // Update password
        const salt = await bcrypt.genSalt(Number(env.BCRYPT_SALT_ROUND));
        const hashedPassword = await bcrypt.hash(new_password, salt);
        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashedPassword }
        });
        return;
    }
};
