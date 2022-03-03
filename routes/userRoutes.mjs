import expressRouter from "express-async-router";
import userRepo from "../dataAccess/repositories/userRoutesRepo";
import authentication from "../middleware/authMiddleware.mjs";
import { schemaValidator } from "../middleware/schemaValidation.mjs";
import { userRouteSchema } from "./Schemas/user.schema.mjs";
const { authenticateToken } = authentication;

export const userRouter = new expressRouter.AsyncRouter();

userRouter.get(
  "/",
  [authenticateToken, schemaValidator.params(userRouteSchema.params)],
  async (req, res) => {
    const result = await userRepo.list();
    res.status(200).json(result);
  }
);

userRouter.get(
  "/:id?",
  [authenticateToken, schemaValidator.params(userRouteSchema.params)],
  async (req, res) => {
    const { id } = req.params;
    const result = await userRepo.get(id);
    res.status(200).json(result);
  }
);

userRouter.put(
  "/update",
  [authenticateToken, schemaValidator.body(userRouteSchema.body)],
  async (req, res) => {
    const { id, name, email, password, role } = req.body;
    const result = await userRepo.update(id, name, email, password, role);
    return res.status(200).json(result);
  }
);
userRouter.delete(
  "/delete/:id",
  [authenticateToken, schemaValidator.params(userRouteSchema.params)],
  async (req, res) => {
    const { id } = req.params;
    const result = await userRepo.deleteUser(id);
    return res.status(200).json(result);
  }
);
