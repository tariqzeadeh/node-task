import expressRouter from "express-async-router";
import postHandlers from "../dataAccess/repositories/postRoutesRepo.mjs";
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

postRouter.get("/", getAllPosts);
postRouter.post("/new-post", addUserPost);
postRouter.get("/post", getUserPost);
postRouter.get("/all-user-post", getAllUserPosts);
postRouter.put("/update-post", updateUserPost);
postRouter.delete("/delete-post", deleteUserPost);
postRouter.delete("/delete-all-posts", deleteAllPost);
postRouter.delete("/delete-all-comments-on-post", deleteAllCommentsOnPost);
