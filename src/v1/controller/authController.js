import { AuthService } from "../service/authService.js";
import { ResponseHandler } from "../common/responseHendler.js";
import { MESSAGE } from "../common/constants.js";

export const AuthController = {
     async signup(req, res) {
          await AuthService.signup(req.body);
          return ResponseHandler.success(res, {
               message: MESSAGE.EMAIL_OTP_SENT
          });
     }
};
