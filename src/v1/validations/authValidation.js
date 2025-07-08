import Joi from "joi";

export const signupSchema = Joi.object({
     full_name: Joi.string().max(255).required(),
     email: Joi.string().email().max(255).required(),
     password: Joi.string().min(6).max(255).required(),
     profile_url: Joi.string().uri().required()
});
