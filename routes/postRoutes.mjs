import expressRouter from "express-async-router";
import postHandlers from "../dataAccess/repositories/postRoutesRepo";
import  authentication from '../middleware/authMiddleware.mjs';
const { authenticateToken } = authentication;
const {
  addUserPost,
  getAllPosts,
  getUserPost,
  updateUserPost,
  deleteUserPost,
  deleteAllPost,
  deleteAllCommentsOnPost,
  getAllUserPosts
} = postHandlers;

export const postRouter = new expressRouter.AsyncRouter();

postRouter.get("/", authenticateToken, getAllPosts);
postRouter.post("/new-post", authenticateToken, addUserPost);
postRouter.get("/post", authenticateToken, getUserPost);
postRouter.get("/all-user-post", authenticateToken, getAllUserPosts);
postRouter.put("/update-post", authenticateToken, updateUserPost);
postRouter.delete("/delete-post", authenticateToken, deleteUserPost);
postRouter.delete("/delete-all-posts", authenticateToken, deleteAllPost);
postRouter.delete("/post/delete-all-comments", authenticateToken, deleteAllCommentsOnPost);
