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
     JWT_EXPIRES_IN: Joi.string().required().messages({
          "any.required": "❌ JWT_EXPIRES_IN is required"
     }),
     BCRYPT_SALT_ROUND: Joi.number().required().messages({
          "any.required": "❌ SALT is required"
     }),
     // SMTP Configuration
     SMTP_HOST: Joi.string().required().messages({
          "any.required": "❌ SMTP_HOST is required"
     }),
     SMTP_PORT: Joi.number().required().messages({
          "any.required": "❌ SMTP_PORT is required"
     }),
     SMTP_SECURE: Joi.boolean().default(false),
     SMTP_USER: Joi.string().required().messages({
          "any.required": "❌ SMTP_USER is required"
     }),
     SMTP_PASS: Joi.string().required().messages({
          "any.required": "❌ SMTP_PASS is required"
     }),
     SMTP_FROM: Joi.string().required().messages({
          "any.required": "❌ SMTP_FROM is required"
     })
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
     JWT_EXPIRES_IN: envVars.JWT_EXPIRES_IN,
     BCRYPT_SALT_ROUND: envVars.BCRYPT_SALT_ROUND,
     // SMTP Configuration
     SMTP_HOST: envVars.SMTP_HOST,
     SMTP_PORT: envVars.SMTP_PORT,
     SMTP_SECURE: envVars.SMTP_SECURE,
     SMTP_USER: envVars.SMTP_USER,
     SMTP_PASS: envVars.SMTP_PASS,
     SMTP_FROM: envVars.SMTP_FROM
};
