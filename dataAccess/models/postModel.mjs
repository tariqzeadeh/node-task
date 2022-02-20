import { sequelize } from "../database.mjs";
import { postSchema } from "../schemas/postSchema.mjs";
import { userModel } from "./userModel.mjs";

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
