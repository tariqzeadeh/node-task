import expressRouter from "express-async-router";
import userRepo from "../dataAccess/repositories/userRoutesRepo.mjs";
const {
  getAllUsers,
  addUser,
  getUser,
  updateUser,
  deleteUser,
} = userRepo;

export const userRouter = new expressRouter.AsyncRouter();

userRouter.get("/", getAllUsers);
userRouter.get("/user/:id", getUser);
userRouter.post("/new-user", addUser);
userRouter.put("/update-user/:id", updateUser);
userRouter.delete("/delete-user/:id", deleteUser);
