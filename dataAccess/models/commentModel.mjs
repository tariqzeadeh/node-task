import { sequelize } from "../database";
import { commentSchema } from "../schemas/commentSchema";
import { postModel } from "./postModel";
// import { userModel } from "./userModel";

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
