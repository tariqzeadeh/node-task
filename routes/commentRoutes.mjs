import expressRouter from "express-async-router";
import commentHandlers from "../dataAccess/repositories/commentRoutesRepo";
import  authentication from '../middleware/authMiddleware.mjs';
const { authenticateToken } = authentication;
const {
  addComment,
  getUserComment,
  getAllComments,
  updateUserComment,
  deleteUserComment,
  deleteAllUserCommentsFromPost,
  deleteAllUserComments,
  getAllUserComment
} = commentHandlers;

export const commentRouter = new expressRouter.AsyncRouter();

commentRouter.get("/", authenticateToken, getAllComments);
commentRouter.get("/user-comment", authenticateToken, getUserComment);
commentRouter.get("/all-user-comments", authenticateToken, getAllUserComment);
commentRouter.post("/new-comment", authenticateToken, addComment);
commentRouter.put("/update-comment", authenticateToken, updateUserComment);
commentRouter.delete("/delete-comment", authenticateToken, deleteUserComment);
commentRouter.delete(
  "/delete-all-comments-from-post",
  deleteAllUserCommentsFromPost
);
commentRouter.delete("/delete-all-comments", deleteAllUserComments);
