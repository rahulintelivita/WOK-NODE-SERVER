export const MESSAGE = {
     SUCCESS: "Your request has been successfully completed.",
     RECORD_CREATED: record => `${record} has been created successfully.`,
     RECORD_UPDATED: record => `${record} has been updated successfully.`,
     RECORD_DELETED: record => `${record} has been deleted successfully.`,
     RECORD_FOUND: record => `${record} found successfully.`,
     RECORD_NOT_FOUND: record => `Sorry, no ${record} was found.`,
     RECORD_UPLOAD: record => `${record} has been uploaded successfully.`,
     METHOD_NOT_ALLOWED: "Sorry, this method is not allowed.",
     ALREADY_EXISTS: record =>
          `A ${record} with the same details already exists.`,
     SIGNUP_SUCCESS: "Signup successful",
     EMAIL_OTP_SENT: "Email OTP sent successfully!",
     OTP_VERIFIED: "OTP verified successfully!",
     INVALID_OTP: "Invalid or expired OTP",
     EMAIL_SENT_SUCCESS: "Email sent successfully!",
     USER_IS_ALREADY_VERIFIED: "User is already verified",
     RESEND_OTP_SUCCESS: "OTP resent to your email",
     PASSWORD_RESET_SUCCESS: "Password reset successfully!",
     FORGOT_PASSWORD_SUCCESS: "If this email exists, an OTP has been sent",
     UNAUTHORIZED: "Unauthorized",
     INVALID_TOKEN: "Invalid token or expired"

};

export const ERROR = {
     TOO_MANY_REQUESTS:
          "You’ve reached the request limit. Please try again later.",
     EMAIL_ALREADY_REGISTERED: "Email already registered",
     VALIDATION_ERROR: "Validation error"
};

export const HTTP_STATUS_CODES = {
     OK: 200,
     BAD_REQUEST: 400,
     UNAUTHORIZED: 401,
     FORBIDDEN: 403
};

export const EMAIL_SUBJECTS = {
     OTP: "Your OTP Code",
     PASSWORD_RESET_OTP: "Your Password Reset OTP"
};
