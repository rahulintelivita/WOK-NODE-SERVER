import { PrismaClient } from "@prisma/client";
import { env } from "../config/env.config.js";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

const OTP_LENGTH = parseInt(env.OTP_LENGTH) || 6;
const OTP_EXPIRES_MINUTES = parseInt(env.OTP_EXPIRES_MINUTES) || 10;

function generateNumericOtp(length) {
     let otp = "";
     const bytes = randomBytes(length);
     for (let i = 0; i < length; i++) {
          otp += (bytes[i] % 10).toString();
     }
     return otp;
}

export const OtpService = {
     async generateOtp({
          userId,
          type,
          expiresInMinutes = OTP_EXPIRES_MINUTES
     }) {
          const otp = generateNumericOtp(OTP_LENGTH);
          const expiresAt = new Date(Date.now() + expiresInMinutes * 60000);
          const createdOtp = await prisma.otp.create({
               data: {
                    user_id: userId,
                    otp,
                    type,
                    expires_at: expiresAt
               }
          });
          return createdOtp;
     },

     async verifyOtp({ userId, otp, type }) {
          const foundOtp = await prisma.otp.findFirst({
               where: {
                    user_id: userId,
                    otp,
                    type,
                    verified: false,
                    expires_at: {
                         gt: new Date()
                    }
               }
          });
          if (!foundOtp) return false;
          await prisma.otp.update({
               where: { id: foundOtp.id },
               data: { verified: true }
          });
          return true;
     },

     async invalidateOtps({ userId, type }) {
          await prisma.otp.updateMany({
               where: {
                    user_id: userId,
                    type,
                    verified: false
               },
               data: { verified: true }
          });
     }
};
