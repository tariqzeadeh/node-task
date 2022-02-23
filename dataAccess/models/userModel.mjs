import { sequelize } from "../database";
import { userSchema } from "../schemas/userSchema";

export const userModel = sequelize.define(
  "user",
  userSchema,
  {
    underscored: true,
    timestamps: true,
  },
  { freezeTableName: true }
);
