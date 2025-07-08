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
               message: MESSAGE.OTP_VERIFIED
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
     }
};
