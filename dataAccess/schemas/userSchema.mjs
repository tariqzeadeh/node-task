import Sequelize from "sequelize";
const { DataTypes } = Sequelize;

export const userSchema = {
  // uuid: {
  //   type: DataTypes.UUID,
  //   defaultValue: DataTypes.UUIDV4,
  // },
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  firstName: {
    field: "firstName",
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    field: "lastName",
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    field: "email",
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    field: "role",
    type: DataTypes.STRING,
    allowNull: false,
  },
};
