import Joi from "joi";

export const userRouteSchema = {
  params: Joi.object({
    id: Joi.number(),
  }),
  body: Joi.object({
    query: Joi.string(),
    id: Joi.number(),
    name: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().min(5),
    role: Joi.string(),
  }),
};
