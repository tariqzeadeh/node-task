import Sequelize from "sequelize";
const { DataTypes } = Sequelize;

export const postSchema = {
//   uuid: {
//     type: DataTypes.UUID,
//     defaultValue: DataTypes.UUIDV4,
//   },
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
  },
  body: {
    field: "body",
    type: DataTypes.TEXT,
    allowNull: false,
  },
  
};