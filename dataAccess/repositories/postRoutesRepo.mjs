import { postModel } from "../models/postModel.mjs";
import { userModel } from "../models/userModel.mjs";
import { commentModel } from "../models/commentModel.mjs";

export default {
  
  addUserPost: async (req, res) => {
    const { userId, body } = req.body;
    try {
      const user = await userModel.findByPk(userId);
      if (user) {
        const newPost = await postModel.create({ userId: userId, body: body });
        return res.json(newPost);
      } else {
        return res.status(404).send("User Not Found");
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
        return res.status(404).send("No Posts Found");
      }
    } catch (err) {
      console.log(err);
    }
  },

  getUserPost: async (req, res) => {
    const { id, userId } = req.body;
    try {
      const user = await userModel.findByPk(userId);
      if (user) {
        const post = await postModel.findOne({
          where: { id: id, userId: userId },
          include: [{ model: commentModel }],
        });
        if (post) {
          return res.json(post);
        } else {
          return res.status(404).send("Post Not Found");
        }
      } else {
        return res.status(404).send("User Not Found");
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
          return res.status(404).send("The user dont have posts");
        }
      } else {
        return res.status(404).send("User Not Found");
      }
    } catch (err) {
      console.log(err);
    }
  },

  updateUserPost: async (req, res) => {
    const { id, userId, body } = req.body;
    try {
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
          return res.status(404).send("Post Not Found");
        }
      } else {
        return res.status(404).send("User Not Found");
      }
    } catch (err) {
      console.log(err);
    }
  },

  deleteUserPost: async (req, res) => {
    const { id, userId } = req.body;
    try {
      const user = await userModel.findByPk(userId);
      if (user) {
        const post = await postModel.findOne({
          where: { id: id, userId: userId },
        });
        if (post) {
          commentModel.destroy({ where: { postId: id } });
          post.destroy();
          return res.json("Post successfully deleted");
        } else {
          return res.status(404).send("Post Not Found");
        }
      } else {
        return res.status(404).send("User Not Found");
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
          return res.json("All posts successfully deleted");
        } else {
          return res.status(404).send("The User Dont Have Any Post Yet");
        }
      } else {
        return res.status(404).send("User Not Found");
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
        commentModel.destroy({ where: { postId: postId } });
        return res.json("All comments on the post are successfully deleted");
      } else {
        return res.status(404).send("The User Dont Have Any Post Yet");
      }
    } catch (err) {
      console.log(err);
    }
  },
};
