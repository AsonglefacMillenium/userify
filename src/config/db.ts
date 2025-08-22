import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME || "userify_db",
  process.env.DB_USER || "postgres",
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30_000,
      idle: 10_000,
    },
  }
);

export default sequelize;
