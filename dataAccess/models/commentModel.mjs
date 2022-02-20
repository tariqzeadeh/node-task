import { sequelize } from "../database.mjs";
import { commentSchema } from "../schemas/commentSchema.mjs";
import { postModel } from "./postModel.mjs";
// import { userModel } from "./userModel.mjs";

export const commentModel = sequelize.define(
  "comment",
  commentSchema,
  {
    underscored: true,
    timestamps: true,
  },
  { freezeTableName: true }
);
postModel.hasMany(commentModel, { foreignKey: "post_id" });
postModel.hasOne(commentModel, { foreignKey: "post_id" });
commentModel.belongsTo(postModel);

// userModel.hasMany(commentModel, { foreignKey: "user_id" });
// userModel.hasOne(commentModel, { foreignKey: "user_id" });
// commentModel.belongsTo(userModel);
