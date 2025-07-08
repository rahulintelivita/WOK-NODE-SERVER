import { AuthService } from "../service/authService.js";
import { ResponseHandler } from "../common/responseHendler.js";
import { MESSAGE } from "../common/constants.js";

export const AuthController = {
     async signup(req, res) {
          try {
               await AuthService.signup(req.body, res);
               return ResponseHandler.success(res, {
                    message: MESSAGE.SIGNUP_SUCCESS
               });
          } catch (error) {
               throw error;
          }
     }
};
