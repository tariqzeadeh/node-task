import Joi from "joi";

export const authRouteSchema = {
  signUpSchema: {
    body: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(5).required(),
      role: Joi.string(),
    }),
  },
  signInSchema: {
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(5).required(),
    }),
  },
};
