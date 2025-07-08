import { TokenService } from "../service/tokenService.js";
import { HTTP_STATUS_CODES, MESSAGE } from "../common/constants.js";
export async function authMiddleware(req, res, next) {
     try {
          const authHeader = req.headers.authorization;
          if (!authHeader || !authHeader.startsWith("Bearer ")) {
               return res
                    .status(HTTP_STATUS_CODES.UNAUTHORIZED)
                    .json({ success: 0, message: MESSAGE.UNAUTHORIZED });
          }
          const token = authHeader.split(" ")[1];
          const { valid, decoded } = await TokenService.verifyToken(token);
          if (!valid) {
               return res
                    .status(HTTP_STATUS_CODES.UNAUTHORIZED)
                    .json({ success: 0, message: MESSAGE.INVALID_TOKEN });
          }
          req.user = decoded;
          next();
     } catch (err) {
          return res
               .status(HTTP_STATUS_CODES.UNAUTHORIZED)
               .json({ success: 0, message: MESSAGE.UNAUTHORIZED });
     }
}
