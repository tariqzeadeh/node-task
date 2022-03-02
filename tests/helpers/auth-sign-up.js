import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModel } from "../../dataAccess/models/userModel";
import dotenv from 'dotenv'
dotenv.config();
export const signUp = async (userSchema) => {
  try {
    console.log(`SIGN UP userSchema: ${userSchema.name} , ${userSchema.email}, ${userSchema.password} , ${userSchema.role} , USERMODEL: ${userModel} `)
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userSchema.password, salt);
    const userRole = userSchema.role || "User";
    const user = await userModel.create({
      name: userSchema.name,
      email: userSchema.email,
      password: hashedPassword,
      role: userRole,
    });

    const newUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    const accessToken = await generateAccessToken(newUser);
    console.log(`accessToken: ${accessToken}`)
    return accessToken;
  } catch (err) {
    console.log(`ERR IN SIGN UP :- ${err}`);
  }
};

const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
  };