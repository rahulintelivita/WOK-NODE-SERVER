import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

const envVarsSchema = Joi.object({
     PORT: Joi.number().required().messages({
          "any.required": "❌ PORT is required"
     }),
     NODE_ENV: Joi.string()
          .valid("development", "production")
          .default("development")
          .messages({
               "any.only": "❌ NODE_ENV must be one of development, production"
          }),

     DATABASE_URL: Joi.string().required().messages({
          "any.required": "❌ DATABASE_URL is required"
     }),
     MAX_LOGGER_FILES_DURATION: Joi.string().messages({
          "any.required": "❌ MAX_LOGGER_FILES_DURATION is required"
     }),
     OTP_LENGTH: Joi.number().default(6),
     OTP_EXPIRES_MINUTES: Joi.number().default(10),
     JWT_SECRET: Joi.string().required().messages({
          "any.required": "❌ JWT_SECRET is required"
     }),
     JWT_EXPIRES_IN: Joi.string().default("30d")
}).unknown();

const { value: envVars, error } = envVarsSchema.validate(process.env);

if (error) {
     throw new Error(`Config validation error: ${error.message}`);
}

export const env = {
     PORT: envVars.PORT,
     NODE_ENV: envVars.NODE_ENV,
     DATABASE_URL: envVars.DATABASE_URL,
     MAX_LOGGER_FILES_DURATION: envVars.MAX_LOGGER_FILES_DURATION,
     OTP_LENGTH: envVars.OTP_LENGTH,
     OTP_EXPIRES_MINUTES: envVars.OTP_EXPIRES_MINUTES,
     JWT_SECRET: envVars.JWT_SECRET,
     JWT_EXPIRES_IN: envVars.JWT_EXPIRES_IN
};
