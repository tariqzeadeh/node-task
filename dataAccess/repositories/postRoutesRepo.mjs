import { postModel } from "../models/postModel";
import { userModel } from "../models/userModel";
import { commentModel } from "../models/commentModel";

export default {
  create: async (userId, body) => {
    try {
      const newPost = await postModel.create({
        userId: userId,
        body: body,
      });
      return newPost;
    } catch (err) {
      console.log(err);
    }
  },
  list: async (query, userId) => {
    switch (query) {
      case "allPosts":
        try {
          const allPosts = await postModel.findAll({
            include: [{ model: userModel, model: commentModel }],
          });
          return allPosts ? allPosts : [];
        } catch (err) {
          console.log(err);
        }
        break;
      case "allUserPosts":
        try {
          const posts = await postModel.findAll({
            where: { userId: userId },
            include: [{ model: commentModel }],
          });

          return posts ? posts : [];
        } catch (err) {
          console.log(err);
        }
      default:
        break;
    }
  },
  get: async (id) => {
    try {
      const post = await postModel.findOne({
        where: { id: id },
        include: [{ model: commentModel }],
      });
      return post ? post : {};
    } catch (err) {
      console.log(err);
    }
  },

  update: async (id, body) => {
    try {
      const post = await postModel.findOne({
        where: { id: id },
      });
      if (post) {
        post.body = body;
        post.save();
      }
      return post ? post : {};
    } catch (err) {
      console.log(err);
    }
  },

  deleteList: async (query, id, userId) => {
    switch (query) {
      case "delete-all-user-posts":
        try {
          await postModel.destroy({ where: { userId: userId } });
          return { message: "All Posts Successfully deleted" };
        } catch (err) {
          console.log(err);
        }
        break;
      case "delete-comments-from-post":
        try {
          await commentModel.destroy({ where: { postId: id } });
          return { message: "All comments Successfully deleted" };
        } catch (err) {
          console.log(err);
        }
        break;
      default:
        break;
    }
    try {
    } catch (err) {
      console.log(err);
    }
  },

  deleteOne: async (id) => {
    try {
      await postModel.destroy({ where: { id: id } });
      return { message: "Post Successfully deleted" };
    } catch (err) {
      console.log(err);
    }
  },
};
