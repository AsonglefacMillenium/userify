import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME || "userify_db",
  process.env.DB_USER || "postgres",
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
    logging: false,
  }
);

export default sequelize;
