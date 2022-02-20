import { userModel } from "../dataAccess/models/userModel.mjs";
import { postModel } from "../dataAccess/models/postModel.mjs";

userModel.hasMany(postModel, {
  foreignKey: "userId",
  as: "posts",
});
postModel.belongsTo(userModel, {
  foreignKey: "userId",
  as: "user",
});
