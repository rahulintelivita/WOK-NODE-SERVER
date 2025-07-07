import { RESPONSE_MESSAGES, HTTP_STATUS_CODES } from "./constants.js";

export const ResponseHandler = {
  /**
   * Sends a success response.
   */
  success: ({ res, data = null, message = RESPONSE_MESSAGES.SUCCESS, statusCode = HTTP_STATUS_CODES.OK }) => {
    res.status(statusCode).json({
      success: 1,
      message,
      data: data ?? {}
    });
  },

  /**
   * Sends a failure response.
   */
  error: ({ res, message = RESPONSE_MESSAGES.FAILURE, statusCode = HTTP_STATUS_CODES.BAD_REQUEST, errors = {} }) => {
    res.status(statusCode).json({
      success: 0,
      message,
      errors
    });
  },

  /**
   * Sends a paginated response.
   */
  paginate: ({ res, data, total, page, limit, message = RESPONSE_MESSAGES.SUCCESS, statusCode = HTTP_STATUS_CODES.OK }) => {
    res.status(statusCode).json({
      success: 1,
      message,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  },

  /**
   * Sends an unauthorized response (401).
   */
  unauthorized: ({ res, message = RESPONSE_MESSAGES.UNAUTHORIZED }) => {
    res.status(HTTP_STATUS_CODES.UNAUTHORIZED).json({
      success: 0,
      message
    });
  },

  /**
   * Sends a forbidden response (403).
   */
  forbidden: ({ res, message = RESPONSE_MESSAGES.FORBIDDEN }) => {
    res.status(HTTP_STATUS_CODES.FORBIDDEN).json({
      success: 0,
      message
    });
  }
};
