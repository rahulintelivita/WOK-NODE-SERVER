import Joi from "joi";

export const signupSchema = Joi.object({
     full_name: Joi.string().max(255).required(),
     email: Joi.string().email().max(255).required(),
     password: Joi.string().min(6).max(255).required(),
     profile_url: Joi.string().uri().required()
});

export const verifyOtpSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().required()
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export const resendOtpSchema = Joi.object({
    email: Joi.string().email().required()
});

export const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required()
});

export const verifyResetOtpSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().required()
});

export const resetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().required(),
    new_password: Joi.string().min(6).max(255).required()
});
