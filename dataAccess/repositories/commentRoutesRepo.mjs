import { postModel } from "../models/postModel";
import { userModel } from "../models/userModel";
import { commentModel } from "../models/commentModel";

export default {
  addComment: async (req, res) => {
    const { userId, postId, body } = req.body;
    const validation = userId && postId && body;
    try {
      if (!validation) {
        return res.status(404).json({ message: "Something went wrong" });
      } else {
        const newComment = await commentModel.create({
          userId: userId,
          postId: postId,
          body: body,
        });
        return res.json(newComment);
      }
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
        return res.status(404).json({ message: "No Comments Found" });
      }
    } catch (err) {
      console.log(err);
    }
  },

  getUserComment: async (req, res) => {
    const { id, userId, postId } = req.body;
    const validation = id && userId && postId;
    try {
      if (!validation) {
        return res.status(404).json({ message: "Something went wrong" });
      } else {
        const user = await userModel.findByPk(userId);
        if (user) {
          const post = await postModel.findByPk(postId);
          if (post) {
            const userComment = await commentModel.findOne({
              where: { id: id, userId: userId, postId: postId },
              include: [{ model: postModel }],
            });
            if (userComment) {
              return res.json(userComment);
            } else {
              return res.status(404).json({ message: "Comment Not Found" });
            }
          } else {
            return res
              .status(404)
              .json({ message: "Post Not Found Or Was Deleted" });
          }
        } else {
          return res.status(404).json({ message: "User Not Found" });
        }
      }
    } catch (err) {
      console.log(err);
    }
  },

  getAllUserComment: async (req, res) => {
    const { userId } = req.body;
    try {
      const user = await userModel.findByPk(userId);
      if (user) {
        const userComments = await commentModel.findAll({
          where: { userId: userId },
          include: [{ model: postModel }],
        });
        if (userComments.length !== 0) {
          return res.json(userComments);
        } else {
          return res
            .status(404)
            .json({ message: "The user dont have comments" });
        }
      } else {
        return res.status(404).json({ message: "User Not Found" });
      }
    } catch (err) {
      console.log(err);
    }
  },

  updateUserComment: async (req, res) => {
    const { id, userId, postId, body } = req.body;
    try {
      const validation = id && userId && postId && body;
      if (!validation) {
        return res.status(404).json({ message: "Something went wrong" });
      } else {
        const userComment = await commentModel.findOne({
          where: { id: id, userId: userId, postId: postId },
        });
        if (userComment) {
          userComment.body = body;
          userComment.save();
          return res.json(userComment);
        } else {
          return res.status(404).json({ message: "Comment Not Found" });
        }
      }
    } catch (err) {
      console.log(err);
    }
  },

  deleteUserComment: async (req, res) => {
    const { id, userId, postId } = req.body;
    const validation = id && userId && postId;
    try {
      if (!validation) {
        return res.status(404).json({ message: "Something went wrong" });
      } else {
        const userComment = await commentModel.findOne({
          where: { id: id, userId: userId, postId: postId },
        });
        if (userComment) {
          userComment.destroy();
          return res
            .status(200)
            .json({ message: "Comment successfully deleted" });
        } else {
          return res.status(404).json({ message: "Comment Not Found" });
        }
      }
    } catch (err) {
      console.log(err);
    }
  },

  deleteAllUserCommentsFromPost: async (req, res) => {
    const { userId, postId } = req.body;
    const validation = userId && postId;
    try {
      if (!validation) {
        return res.status(404).json({ message: "Something went wrong" });
      } else {
        const userComments = await commentModel.findAll({
          where: { userId: userId, postId: postId },
        });
        if (userComments.length !== 0) {
          commentModel.destroy({
            where: { userId: userId, postId: postId },
          });
          return res
            .status(200)
            .json({ message: "All comments successfully deleted" });
        } else {
          return res.status(404).json({
            message: "The user dont have comments on the specified post",
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  },

  deleteAllUserComments: async (req, res) => {
    const { userId } = req.body;
    try {
      const user = await userModel.findByPk(userId);
      if (user) {
        const userComments = await commentModel.findAll({
          where: { userId: userId },
        });
        if (userComments.length !== 0) {
          commentModel.destroy({
            where: { userId: userId },
          });
          return res
            .status(200)
            .json({ message: "All comments successfully deleted" });
        } else {
          return res
            .status(404)
            .json({ message: "The user dont have comments" });
        }
      } else {
        return res.status(404).json({ message: "User Not Found" });
      }
    } catch (err) {
      console.log(err);
    }
  },
};
