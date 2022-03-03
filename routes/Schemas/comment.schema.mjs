import Joi from "joi";

export const commentRouteSchema = {
  query: Joi.object({
    q: Joi.string(),
    userId: Joi.number(),
    postId: Joi.number(),
  }),
  params: Joi.object({
    id: Joi.number(),
    userId: Joi.number(),
    postId: Joi.number(),
  }),
  body: Joi.object({
    id: Joi.number(),
    userId: Joi.number(),
    postId: Joi.number(),
    body: Joi.string(),
  }),
};
