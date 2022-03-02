import { userModel } from "../models/userModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default {

  signUp: async (req, res) => {
    const { name, email, password, role } = req.body;
    console.log(`name: ${name} , email: ${email} , password: ${password} , role: ${role}`);
    const user = await userModel.findOne({ where: { email: email } });
    if (user) {
      res.status(400).json({ message: "This Email Is Already Used" });
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
      res.status(201).json({ accessToken: accessToken, user: newUser });
    } catch (err) {
      console.log(err);
    }
  },

  signIn: async (req, res) => {
    const { email, password } = req.body;
    console.log(`email: ${email} , password: ${password}`)
    const user = await userModel.findOne({ where: { email: email } });

    if (!user) {
      res.status(400).json({ message: "User Not Found, Check Your Email" });
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
        res.status(200).json({ accessToken: accessToken, user: loggedUser });
      } else {
        res.status(403).json({ message: "Wrong Password" });
      }
    } catch (err) {
      console.log(err);
    }
  },
};

const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
};
