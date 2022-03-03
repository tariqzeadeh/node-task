import Sequelize from "sequelize";
const { DataTypes } = Sequelize;

export const postSchema = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  userId: {
    field: "user_id",
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
    onDelete: 'cascade',
    onUpdate: 'cascade',
  },
  body: {
    field: "body",
    type: DataTypes.TEXT,
    allowNull: false,
  },
  
};