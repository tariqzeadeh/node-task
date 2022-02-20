import { sequelize } from "../database.mjs";
import { userSchema } from "../schemas/userSchema.mjs";

export const userModel = sequelize.define(
  "user",
  userSchema,
  {
    underscored: true,
    timestamps: true,
  },
  { freezeTableName: true }
);
