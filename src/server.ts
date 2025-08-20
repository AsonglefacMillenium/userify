import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import sequelize from "./config/db";

// Ensure DB connectivity on boot (migrations handle schema)
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connected");
  } catch (e) {
    console.error("❌ DB connection failed:", e);
    process.exit(1);
  }
})();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server listening on ${PORT}`));
