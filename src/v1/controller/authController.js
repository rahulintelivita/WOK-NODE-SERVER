import { AuthService } from "../service/authService.js";
import { ResponseHandler } from "../common/responseHendler.js";
import { MESSAGE } from "../common/constants.js";

export const AuthController = {
     async signup(req, res) {
          await AuthService.signup(req.body);
          return ResponseHandler.success(res, {
               message: MESSAGE.EMAIL_OTP_SENT
          });
     },
     async verifyOtp(req, res) {
          const result = await AuthService.verifyOtp(req.body);
          return ResponseHandler.success(res, {
               message: MESSAGE.OTP_VERIFIED,
               data: result
          });
     },
     async login(req, res) {
          const result = await AuthService.login(req.body);
          return ResponseHandler.success(res, {
               data: result,
               message: "Login successful"
          });
     },
     async resendOtp(req, res) {
          await AuthService.resendOtp(req.body);
          return ResponseHandler.success(res, {
               message: MESSAGE.RESEND_OTP_SUCCESS
          });
     },
     async forgotPassword(req, res) {
          await AuthService.forgotPassword(req.body);
          return ResponseHandler.success(res, {
               message: MESSAGE.FORGOT_PASSWORD_SUCCESS
          });
     },
     async verifyResetOtp(req, res) {
          const result = await AuthService.verifyResetOtp(req.body);
          return ResponseHandler.success(res, {
               message: MESSAGE.OTP_VERIFIED,
               data: result
          });
     },
     async resetPassword(req, res) {
          await AuthService.resetPassword(req.body);
          return ResponseHandler.success(res, {
               message: MESSAGE.PASSWORD_RESET_SUCCESS
          });
     },
     async changePassword(req, res) {
          await AuthService.changePassword({
               userId: req.user.id,
               ...req.body
          });
          return ResponseHandler.success(res, {
               message: "Password changed successfully"
          });
     },
     async getProfile(req, res) {
          const profile = await AuthService.getProfile({ userId: req.user.id });
          return ResponseHandler.success(res, {
               data: profile,
               message: MESSAGE.PROFILE_FETCHED
          });
     },
     async updateProfile(req, res) {
          await AuthService.updateProfile({
               userId: req.user.id,
               ...req.body
          });
          return ResponseHandler.success(res, {
               message: MESSAGE.PROFILE_UPDATED
          });
     },
     async sendDeleteAccountOtp(req, res) {
          await AuthService.sendDeleteAccountOtp({ userId: req.user.id });
          return ResponseHandler.success(res, {
               message: MESSAGE.DELETE_ACCOUNT_OTP_SENT
          });
     },
     async deleteAccount(req, res) {
          await AuthService.deleteAccount({ userId: req.user.id, ...req.body });
          return ResponseHandler.success(res, {
               message: MESSAGE.ACCOUNT_DELETED
          });
     }
};
