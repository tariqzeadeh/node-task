import Sequelize from "sequelize";
const { DataTypes } = Sequelize;

export const userSchema = {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  name: {
    field: "name",
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    field: "email",
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    isEmail: true,
  },
  password: {
    field: "password",
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    field: "role",
    type: DataTypes.STRING,
    allowNull: false,
  },
};
