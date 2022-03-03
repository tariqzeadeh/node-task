import { postModel } from "../models/postModel";
import { commentModel } from "../models/commentModel";

export default {
  create: async (userId, postId, body) => {
    try {
      const newComment = await commentModel.create({
        userId: userId,
        postId: postId,
        body: body,
      });
      return newComment;
    } catch (err) {
      console.log(err);
    }
  },

  list: async (query, userId, postId) => {
    switch (query) {
      case "all-comments":
        try {
          const allComments = await commentModel.findAll({
            include: [{ model: postModel }],
          });
          return allComments;
        } catch (err) {
          console.log(err);
        }
        break;

      case "all-user-comments":
        try {
          const userComments = await commentModel.findAll({
            where: { userId: userId },
            include: [{ model: postModel }],
          });
          return userComments;
        } catch (err) {
          console.log(err);
        }
        break;

      case "all-post-comments":
        try {
          const postComments = await commentModel.findAll({
            where: { postId: postId },
            include: [{ model: postModel }],
          });
          return postComments;
        } catch (err) {
          console.log(err);
        }
        break;

      default:
        break;
    }
  },

  get: async (id) => {
    try {
      const userComment = await commentModel.findOne({
        where: { id: id },
        include: [{ model: postModel }],
      });

      return userComment;
    } catch (err) {
      console.log(err);
    }
  },

  updates: async (id, body) => {
    try {
      const userComment = await commentModel.findOne({
        where: { id: id },
      });
      userComment.body = body;
      userComment.save();
      return userComment;
    } catch (err) {
      console.log(err);
    }
  },

  delete: async (id) => {
    try {
      commentModel.destroy({
        where: { id: id },
      });
      return { message: "Comment successfully deleted" };
    } catch (err) {
      console.log(err);
    }
  },

  deleteList: async (query, userId, postId) => {
    switch (query) {
      case "all-user-comments":
        try {
          await commentModel.destroy({
            where: { userId: userId },
          });
          return { message: "All comments successfully deleted" };
        } catch (err) {
          console.log(err);
        }
        break;
      case "all-user-comments-for-post":
        try {
          await commentModel.destroy({
            where: { userId: userId, postId: postId },
          });
          return { message: "All comments successfully deleted" };
        } catch (err) {
          console.log(err);
        }
        break;
      default:
        break;
    }
  },
};
