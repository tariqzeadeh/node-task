import Sequelize from "sequelize";

export const sequelize = new Sequelize("users-db", "postgres", process.env.POSTGRES_PASSWORD || 'TareqHasan749212', {
  host: "localhost",
  dialect: "postgres",
});
