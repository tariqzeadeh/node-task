import { userModel } from "../models/userModel.mjs";
import { postModel } from "../models/postModel.mjs";
import { commentModel } from "../models/commentModel.mjs";
// import Sequelize from "sequelize";
// const { Op } = Sequelize;
export default {

  getAllUsers: async (req, res) => {
    // const { q } = req.query;
    // let filter = {};
    // if (q) {
    //   filter = {
    //     where: {
    //       firstName: {
    //         [Op.like]: `${q}%`,
    //       },
    //     },
    //     include: [{ model: postModel }],
    //   };
    // }
    try {
      const users = await userModel.findAll({
        include: [{ model: postModel }],
      });
      if (users.length !== 0) {
        return res.json(users);
      } else {
        return res.status(404).send();
      }
    } catch (err) {
      console.log(err);
    }
  },

 
  getUser: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await userModel.findByPk(id, {
        include: [{ model: postModel }],
      });
      if (user) {
        return res.json(user);
      } else {
        return res.status(404).send("User Not Found");
      }
    } catch (err) {
      console.log(err);
    }
  },


  updateUser: async (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, email, role } = req.body;
    console.log("updateUserHandler");
    try {
      const user = await userModel.findByPk(id);
      if (user) {
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.role = role;
        await user.save();
        return res.json(user);
      } else {
        return res.status(404).send("User Not Found");
      }
    } catch (err) {
      console.log(err);
    }
  },

  deleteUser: async (req, res) => {
    console.log("deleteUserHandler");
    const { id } = req.params;
    try {
      const user = await userModel.findByPk(id);
      if (user) {
        await commentModel.destroy({ where: { userId: id } });
        const posts = await postModel.findAll({ where: { userId: id } });
        if (posts.length !== 0) {
          posts.forEach((post) => {
            commentModel.destroy({ where: { postId: post.id } });
          });
          await postModel.destroy({ where: { userId: id } });
        }
        await user.destroy();
        return res.json({
          message: `User has been successfully deleted`,
        });
      } else {
        return res.status(404).send("User Not Found");
      }
    } catch (err) {
      console.log(err);
    }
  },
  
  addUser: async (req, res) => {
    const { firstName, lastName, email, role } = req.body;
    console.log(`first: ${firstName} == last: ${lastName}`);
    try {
      const newUser = await userModel.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        role: role,
      });
      return res.json(newUser);
    } catch (err) {
      console.log(err);
    }
  },
};
