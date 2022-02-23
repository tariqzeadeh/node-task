import { postModel } from "../models/postModel";
import { userModel } from "../models/userModel";
import { commentModel } from "../models/commentModel";

export default {
  addUserPost: async (req, res) => {
    const { userId, body } = req.body;
    const validation = userId && body;
    try {
      if (!validation) {
        return res.status(404).json({ message: "Something went wrong" });
      } else {
        const user = await userModel.findByPk(userId);
        if (user) {
          const newPost = await postModel.create({
            userId: userId,
            body: body,
          });
          return res.json(newPost);
        } else {
          return res.status(404).json({ message: "User Not Found" });
        }
      }
    } catch (err) {
      console.log(err);
    }
  },

  getAllPosts: async (req, res) => {
    try {
      const allPosts = await postModel.findAll({
        include: [{ model: userModel, model: commentModel }],
      });
      if (allPosts.length !== 0) {
        return res.json(allPosts);
      } else {
        return res.status(404).json({ message: "No Posts Found" });
      }
    } catch (err) {
      console.log(err);
    }
  },

  getUserPost: async (req, res) => {
    const { id, userId } = req.body;
    const validation = id && userId;
    try {
      if (!validation) {
        return res.status(404).json({ message: "Something went wrong" });
      } else {
        const user = await userModel.findByPk(userId);
        if (user) {
          const post = await postModel.findOne({
            where: { id: id, userId: userId },
            include: [{ model: commentModel }],
          });
          if (post) {
            return res.json(post);
          } else {
            return res.status(404).json({ message: "Post Not Found" });
          }
        } else {
          return res.status(404).send({ message: "User Not Found" });
        }
      }
    } catch (err) {
      console.log(err);
    }
  },

  getAllUserPosts: async (req, res) => {
    const { userId } = req.body;
    try {
      const user = await userModel.findByPk(userId);
      if (user) {
        const posts = await postModel.findAll({
          where: { userId: userId },
          include: [{ model: commentModel }],
        });
        if (posts.length !== 0) {
          return res.json(posts);
        } else {
          return res.status(404).json({ message: "The user dont have posts" });
        }
      } else {
        return res.status(404).send({ message: "User Not Found" });
      }
    } catch (err) {
      console.log(err);
    }
  },

  updateUserPost: async (req, res) => {
    const { id, userId, body } = req.body;
    const validation = id && userId && body;
    try {
      if (!validation) {
        return res.status(404).json({ message: "Something went wrong" });
      } else {
        const user = await userModel.findByPk(userId);
        if (user) {
          const post = await postModel.findOne({
            where: { id: id, userId: userId },
          });
          if (post) {
            post.body = body;
            post.save();
            return res.json(post);
          } else {
            return res.status(404).json({ message: "Post Not Found" });
          }
        } else {
          return res.status(404).send({ message: "User Not Found" });
        }
      }
    } catch (err) {
      console.log(err);
    }
  },

  deleteUserPost: async (req, res) => {
    const { id, userId } = req.body;
    const validation = id && userId;
    try {
      if (!validation) {
        return res.status(404).json({ message: "Something went wrong" });
      } else {
        const user = await userModel.findByPk(userId);
        if (user) {
          const post = await postModel.findOne({
            where: { id: id, userId: userId },
          });
          if (post) {
            commentModel.destroy({ where: { postId: id } });
            post.destroy();
            return res
              .status(200)
              .json({ message: "Post successfully deleted" });
          } else {
            return res.status(404).json({ message: "Post Not Found" });
          }
        } else {
          return res.status(404).json({ message: "User Not Found" });
        }
      }
    } catch (err) {
      console.log(err);
    }
  },

  deleteAllPost: async (req, res) => {
    const { userId } = req.body;
    try {
      const user = await userModel.findByPk(userId);
      if (user) {
        const posts = await postModel.findAll({
          where: { userId: userId },
        });
        if (posts.length !== 0) {
          posts.forEach((post) => {
            commentModel.destroy({ where: { postId: post.id } });
            post.destroy();
          });
          return res.json({ message: "All posts successfully deleted" });
        } else {
          return res
            .status(404)
            .json({ message: "The User Dont Have Any Post Yet" });
        }
      } else {
        return res.status(404).json({ message: "User Not Found" });
      }
    } catch (err) {
      console.log(err);
    }
  },

  deleteAllCommentsOnPost: async (req, res) => {
    const { postId } = req.body;
    try {
      const post = await postModel.findByPk(postId);
      if (post) {
        const comments = await commentModel.findAll({ where: { postId: postId } });
        if (comments.length !== 0) {
          await commentModel.destroy({ where: { postId: postId } });
          return res.status(200).json({
            message: "All comments on the post are successfully deleted",
          });
        } else {
          return res.status(404).json({
            message: "No comments found on this post",
          });
        }
      } else {
        return res
          .status(404)
          .json({ message: "Post Not Found" });
      }
    } catch (err) {
      console.log(err);
    }
  },
};
