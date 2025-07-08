import { AuthService } from "../service/authService.js";
import { ResponseHandler } from "../common/responseHendler.js";
import { MESSAGE } from "../common/constants.js";

export const AuthController = {
     async signup(req, res) {
          try {
               const user = await AuthService.signup(req.body, res);

               // If AuthService returns an error response, don't proceed
               if (user && user.success === 0) {
                    return user; // This is already a ResponseHandler.error response
               }

               return ResponseHandler.success({
                    res,
                    data: { user },
                    message: MESSAGE.SIGNUP_SUCCESS
               });
          } catch (error) {
               // Re-throw the error to be caught by global error handler
               throw error;
          }
     }
};
