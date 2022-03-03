import expressRouter from "express-async-router";
import postRepo from "../dataAccess/repositories/postRoutesRepo";
import authentication from "../middleware/authMiddleware.mjs";
import { schemaValidator } from "../middleware/schemaValidation.mjs";
import { postRouteSchema } from "./Schemas/post.schema.mjs";
const { authenticateToken } = authentication;

export const postRouter = new expressRouter.AsyncRouter();

postRouter.get(
  "/list",
  [authenticateToken, schemaValidator.query(postRouteSchema.query)],
  async (req, res) => {
    const { query, userId } = req.query;
    const result = await postRepo.list(query, userId);
    return res.status(200).json(result);
  }
);
postRouter.get(
  "/:id",
  [authenticateToken, schemaValidator.params(postRouteSchema.params)],
  async (req, res) => {
    const { id } = req.params;
    const result = await postRepo.get(id);
    return res.status(200).json(result);
  }
);

postRouter.post(
  "/new-post",
  [authenticateToken, schemaValidator.body(postRouteSchema.body)],
  async (req, res) => {
    const { userId, body } = req.body;
    const result = await postRepo.create(userId, body);
    return res.status(200).json(result);
  }
);
postRouter.put(
  "/update-post",
  [authenticateToken, schemaValidator.body(postRouteSchema.body)],
  async (req, res) => {
    const { id, body } = req.body;
    const result = await postRepo.update(id, body);
    return res.status(200).json(result);
  }
);
postRouter.delete(
  "/delete/list",
  [authenticateToken, schemaValidator.query(postRouteSchema.query)],
  async (req, res) => {
    const { query, id, userId } = req.query;
    const result = await postRepo.deleteList(query, id, userId);
    return res.status(200).json(result);
  }
);
postRouter.delete(
  "/delete-post/:id",
  [authenticateToken, schemaValidator.params(postRouteSchema.params)],
  async (req, res) => {
    const { id } = req.params;
    const result = await postRepo.deleteOne(id);
    return res.status(200).json(result);
  }
);
