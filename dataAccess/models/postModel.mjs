import { sequelize } from "../database";
import { postSchema } from "../schemas/postSchema";
import { userModel } from "./userModel";

export const postModel = sequelize.define(
  "post",
  postSchema,
  {
    underscored: true,
    timestamps: true,
  },
  { freezeTableName: true }
);
userModel.hasMany(postModel, { foreignKey: "user_id" });
userModel.hasOne(postModel, { foreignKey: "user_id" });
postModel.belongsTo(userModel);
