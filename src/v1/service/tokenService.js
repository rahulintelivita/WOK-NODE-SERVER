import moment from "moment";
import jwt from "jsonwebtoken";
import { env } from "../config/env.config.js";
import { prisma } from "../config/db.js";

export const TokenService = {
     async createToken({
          userId,
          provider = 0,
          googleId = null,
          appleId = null,
          firebaseToken = null,
          expiresAt = null,
          payload = {}
     }) {
          // Invalidate previous tokens for this user/provider
          await prisma.token.updateMany({
               where: { user_id: userId, provider, deleted_at: 0 },
               data: { deleted_at: moment().unix() }
          });
          // Generate JWT access token
          const jwtPayload = { userId, provider, ...payload };
          const jwtOptions = { expiresIn: env.JWT_EXPIRES_IN };
          const accessToken = jwt.sign(jwtPayload, env.JWT_SECRET, jwtOptions);
          // Set expiresAt if not provided
          const tokenExpiresAt =
               expiresAt ||
               moment().add(moment.duration(env.JWT_EXPIRES_IN)).toDate();
          // Create new token
          return prisma.token.create({
               data: {
                    user_id: userId,
                    access_token: accessToken,
                    provider,
                    google_id: googleId,
                    apple_id: appleId,
                    firebase_token: firebaseToken,
                    expires_at: tokenExpiresAt,
                    created_at: moment().unix(),
                    updated_at: moment().unix(),
                    deleted_at: 0
               }
          });
     },

     async findToken({ userId, provider = 0 }) {
          return prisma.token.findFirst({
               where: { user_id: userId, provider, deleted_at: 0 }
          });
     },

     async invalidateToken({ tokenId }) {
          return prisma.token.update({
               where: { id: tokenId },
               data: { deleted_at: moment().unix() }
          });
     },

     async updateToken({ tokenId, accessToken, expiresAt }) {
          return prisma.token.update({
               where: { id: tokenId },
               data: {
                    access_token: accessToken,
                    expires_at: expiresAt,
                    updated_at: moment().unix()
               }
          });
     },

     async verifyToken(token) {
          try {
               const decoded = jwt.verify(token, env.JWT_SECRET);
               return { valid: true, decoded };
          } catch (err) {
               return { valid: false, error: err.message };
          }
     }
};
