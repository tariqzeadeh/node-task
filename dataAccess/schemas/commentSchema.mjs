import Sequelize from "sequelize";
const { DataTypes } = Sequelize;

export const commentSchema = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  userId: {
    field: "userId",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  postId:{
    field: "post_id",
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  body: {
    field: "body",
    type: DataTypes.TEXT,
    allowNull: false,
  },
  
};