import Joi from "joi";

export const postRouteSchema = {
  params: Joi.object({
    id: Joi.number(),
  }),
  query: Joi.object({
    query: Joi.string(),
    id: Joi.number(),
    userId: Joi.number(),
  }),
  body: Joi.object({
    id: Joi.number(),
    userId: Joi.number(),
    body: Joi.string(),
  }),
};
