import { userModel } from "../models/userModel";
import { postModel } from "../models/postModel";
import bcrypt from "bcrypt";
export default {
  
  list: async () =>{
    try {
      const users = await userModel.findAll({
        include: [{ model: postModel }],
        attributes: ["id", "name", "email", "role"],
      });
      return users ? users : [];
    } catch (err) {
      console.log(err);
    }
  },
  get: async (id) => {
    try {
      const user = await userModel.findByPk(id, {
        include: [{ model: postModel }],
        attributes: ["id", "name", "email", "role"],
      });

      return user ? user : {};
    } catch (err) {
      console.log(err);
    }
  },
  update: async (id, name, email, password, role) => {
    try {
      const user = await userModel.findByPk(id);
      if (user) {
        const hashedPassword = password !== "same"
          ? await passwordEncryption(password)
          : user.password;
        user.name = name || user.name;
        user.email = email || user.email;
        user.password = hashedPassword;
        user.role = role || user.role;
        await user.save();
      }
      return user ? user : {};
    } catch (err) {
      console.log(err);
    }
  },

  deleteUser: async (id) => {
    try {
      const user = await userModel.findByPk(id);
      await user.destroy();
      return {
        message: `User has been successfully deleted`,
      };
    } catch (err) {
      console.log(err);
    }
  },
};

const passwordEncryption = async (password) => {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};
