import { userModel } from "../dataAccess/models/userModel";
import { postModel } from "../dataAccess/models/postModel";

userModel.hasMany(postModel, {
  foreignKey: "userId",
  as: "posts",
});
postModel.belongsTo(userModel, {
  foreignKey: "userId",
  as: "user",
});
