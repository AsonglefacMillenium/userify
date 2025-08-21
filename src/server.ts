import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import sequelize from "./config/db";

// Ensure DB connectivity on boot (migrations handle schema)
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Successfully connected to the Database");
  } catch (e) {
    console.error("Database connection failed:", e);
    process.exit(1);
  }
})();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`The server is running on PORT ${PORT}`));
