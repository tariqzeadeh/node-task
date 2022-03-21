import expressRouter from "express-async-router";
import commentRepo from "../dataAccess/repositories/commentRoutesRepo";
import authentication from "../middleware/authMiddleware.mjs";
import { schemaValidator } from "../middleware/schemaValidation.mjs";
import { commentRouteSchema } from "./Schemas/comment.schema.mjs";
const { authenticateToken } = authentication;

export const commentRouter = new expressRouter.AsyncRouter();

commentRouter.get(
  "/list",
  [authenticateToken, schemaValidator.query(commentRouteSchema.query)],
  async (req, res) => {
    const { q, userId, postId } = req.query;
    const result = await commentRepo.list(q, userId, postId);
    res.status(200).json(result);
  }
);
commentRouter.get(
  "/:id",
  [authenticateToken, schemaValidator.params(commentRouteSchema.params)],
  async (req, res) => {
    const { id } = req.params;
    const result = await commentRepo.get(id);
    return res.status(200).json(result);
  }
);
commentRouter.post(
  "/new-comment",
  [authenticateToken, schemaValidator.body(commentRouteSchema.body)],
  async (req, res) => {
    const { userId, postId, body } = req.body;
    const result = await commentRepo.create(userId, postId, body);
    return res.status(200).json(result);
  }
);
commentRouter.put(
  "/update-comment",
  [authenticateToken, schemaValidator.body(commentRouteSchema.body)],
  async (req, res) => {
    const { id, body } = req.body;
    const result = await commentRepo.update(id, body);
    res.status(200).json(result);
  }
);
commentRouter.delete(
  "/delete/list",
  [authenticateToken, schemaValidator.query(commentRouteSchema.query)],
  async (req, res) => {
    const { q, userId, postId } = req.query;
    const result = await commentRepo.deleteList(q, userId, postId);
    return res.status(200).json(result);
  }
);
commentRouter.delete(
  "/delete/:id",
  [authenticateToken, schemaValidator.params(commentRouteSchema.params)],
  async (req, res) => {
    const { id } = req.params;
    const result = await commentRepo.delete(id);
    return res.status(200).json(result);
  }
);
