import { postModel } from "../models/postModel.mjs";
import { userModel } from "../models/userModel.mjs";
import { commentModel } from "../models/commentModel.mjs";

export default {
    
  addComment: async (req, res) => {
    const { userId, postId, body } = req.body;
    try {
      const newComment = await commentModel.create({
        userId: userId,
        postId: postId,
        body: body,
      });
      return res.json(newComment);
    } catch (err) {
      console.log(err);
    }
  },

  getAllComments: async (req, res) => {
    try {
      const allComments = await commentModel.findAll({
        include: [{ model: postModel }],
      });
      if (allComments.length !== 0) {
        return res.json(allComments);
      } else {
        return res.status(404).send("No Comments Found");
      }
    } catch (err) {
      console.log(err);
    }
  },

  getUserComment: async (req, res) => {
    const { id, userId, postId } = req.body;
    try {
      const userComment = await commentModel.findOne({
        where: { id: id, userId: userId, postId: postId },
        include: [{ model: postModel }],
      });
      if (userComment) {
        return res.json(userComment);
      } else {
        return res.status(404).send("Comment Not Found");
      }
    } catch (err) {
      console.log(err);
    }
  },

  getAllUserComment: async (req, res) => {
    const { userId } = req.body;
    try {
      const userComments = await commentModel.findAll({
        where: { userId: userId },
        include: [{ model: postModel }],
      });
      console.log(typeof userComments);
      console.log(userComments);
      if (userComments.length !== 0) {
        return res.json(userComments);
      } else {
        return res.status(404).send("The user dont have comments");
      }
    } catch (err) {
      console.log(err);
    }
  },

  updateUserComment: async (req, res) => {
    const { id, userId, postId, body } = req.body;
    try {
      const userComment = await commentModel.findOne({
        where: { id: id, userId: userId, postId: postId },
      });
      if (userComment) {
        userComment.body = body;
        userComment.save();
        return res.json(userComment);
      } else {
        return res.status(404).send("Comment Not Found");
      }
    } catch (err) {
      console.log(err);
    }
  },

  deleteUserComment: async (req, res) => {
    const { id, userId, postId } = req.body;
    try {
      const userComment = await commentModel.findOne({
        where: { id: id, userId: userId, postId: postId },
      });
      if (userComment) {
        userComment.destroy();
        return res.json("Comment successfully deleted");
      } else {
        return res.status(404).send("Comment Not Found");
      }
    } catch (err) {
      console.log(err);
    }
  },

  deleteAllUserCommentsFromPost: async (req, res) => {
    const { userId, postId } = req.body;
    try {
      const userComments = await commentModel.findAll({
        where: { userId: userId, postId: postId },
      });
      if (userComments.length !== 0) {
        commentModel.destroy({
          where: { userId: userId, postId: postId },
        });
        return res.json("All comments successfully deleted");
      } else {
        return res
          .status(404)
          .send("The user dont have comments on the specified post");
      }
    } catch (err) {
      console.log(err);
    }
  },

  deleteAllUserComments: async (req, res) => {
    const { userId } = req.body;
    try {
      const userComments = await commentModel.findAll({
        where: { userId: userId },
      });
      if (userComments.length !== 0) {
        commentModel.destroy({
          where: { userId: userId },
        });
        return res.json("All comments successfully deleted");
      } else {
        return res.status(404).send("The user dont have comments");
      }
    } catch (err) {
      console.log(err);
    }
  },
};
