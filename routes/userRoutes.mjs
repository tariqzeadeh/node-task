import expressRouter from "express-async-router";
import userRepo from "../dataAccess/repositories/userRoutesRepo";
import  authentication from '../middleware/authMiddleware.mjs'
const { authenticateToken } = authentication;
const {
  getAllUsers,
  // addUser,
  getUser,
  updateUser,
  deleteUser,
} = userRepo;

export const userRouter = new expressRouter.AsyncRouter();

userRouter.get("/", authenticateToken, getAllUsers);
userRouter.get("/user/:id", authenticateToken, getUser);
// userRouter.post("/new-user", authenticateToken, addUser);
userRouter.put("/update-user", authenticateToken, updateUser);
userRouter.delete("/delete-user", authenticateToken, deleteUser);
