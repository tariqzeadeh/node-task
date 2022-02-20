import expressRouter from "express-async-router";
import commentHandlers from "../dataAccess/repositories/commentRoutesRepo.mjs";
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

commentRouter.get("/", getAllComments);
commentRouter.get("/user-comment", getUserComment);
commentRouter.get("/all-user-comment", getAllUserComment);
commentRouter.post("/new-comment", addComment);
commentRouter.put("/update-comment", updateUserComment);
commentRouter.delete("/delete-comment", deleteUserComment);
commentRouter.delete(
  "/delete-all-comments-from-post",
  deleteAllUserCommentsFromPost
);
commentRouter.delete("/delete-all-comments", deleteAllUserComments);
