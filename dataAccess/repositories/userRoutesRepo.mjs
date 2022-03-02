import { userModel } from "../models/userModel";
import { postModel } from "../models/postModel";
import { commentModel } from "../models/commentModel";
import bcrypt from "bcrypt";
export default {
  getAllUsers: async (req, res) => {
    try {
      const users = await userModel.findAll({
        include: [{ model: postModel }],
        attributes: ["id", "name", "email", "role"],
      });
      if (users.length !== 0) {
        return res.json(users);
      } else {
        return res.status(404).json({ message: "NO Users Found" });
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
        attributes: ["id", "name", "email", "role"],
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
    const { id, name, email, password, role } = req.body;
    console.log("updateUserHandler");
    try {
      const user = await userModel.findByPk(id);
      console.log(user);
      if (user) {
        const hashedPassword = password
          ? await passwordEncryption(password)
          : user.password;
        user.name = name || user.name;
        user.email = email || user.email;
        user.password = hashedPassword;
        user.role = role || user.role;
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
    const { id } = req.body;
    try {
      const user = await userModel.findByPk(id);
      if (user) {
        await commentModel.destroy({ where: { userId: id } });
        const posts = await postModel.findAll({ where: { userId: id } });
        if (posts.length !== 0) {
          posts.forEach(async (post) => {
            await commentModel.destroy({ where: { postId: post.id } });
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

  // addUser: async (req, res) => {
  //   const { name, email, password, role } = req.body;
  //   const validation = name && email && password && role;
  //   try {
  //     if (!validation) {
  //       return res.status(404).send("Some thing went wrong");
  //     } else {
  //       const newUser = await userModel.create({
  //         name: name,
  //         email: email,
  //         password: password,
  //         role: role,
  //       });
  //       return res.json(newUser);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // },
};

const passwordEncryption = async (password) => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};
