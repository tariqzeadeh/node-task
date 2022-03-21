import { userModel } from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default {
  signUp: async (name, email, password, role) => {
    const user = await userModel.findOne({ where: { email: email } });
    if (user) {
      return {
        error: {
          status: 200,
          message: "This Email Is Already Used",
        },
      };
    }
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      const userRole = role || "User";
      const user = await userModel.create({
        name: name,
        email: email,
        password: hashedPassword,
        role: userRole,
      });

      const newUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };
      const accessToken = generateAccessToken(newUser);
      return {
        status: 201,
        response: { accessToken: accessToken, user: newUser },
      };
    } catch (err) {
      console.log(err);
    }
  },

  signIn: async (email, password) => {
    const user = await userModel.findOne({ where: { email: email } });
    console.log(user);
    if (!user) {
      return {
        error: {
          status: 200,
          message: "User Not Found, Check Your Email",
        },
      };
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        const loggedUser = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
        const accessToken = generateAccessToken(loggedUser);
        return {
          status: 201,
          response: { accessToken: accessToken, user: loggedUser },
        };
      } else {
        return {
          error: {
            status: 200,
            message: "Wrong Password",
          },
        };
      }
    } catch (err) {
      console.log(err);
    }
  },
};

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
};
