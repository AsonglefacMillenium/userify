import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import sequelize from "./config/db";




const PORT = Number(process.env.PORT) || 5000;


let server: import("http").Server

// Ensure DB connectivity on boot (migrations handle schema)
(async () => {
  try {
    await sequelize.authenticate();
    console.log("Successfully connected to the Database");

    server = app.listen(PORT, () => 
      console.log(`The server is running on PORT ${PORT}`)
  );
  } catch (e) {
    console.error("Database connection failed:", e);
    process.exit(1);
  }
})();




process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  
  process.exit(1);
});


const shutdown = async (signal: string) => {
  console.log(`Received ${signal}. Closing gracefully...`);
  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server.close((err) => (err ? reject(err) : resolve()));
      });
    }
    await sequelize.close();
    console.log("Closed HTTP server and DB connection.");
    process.exit(0);
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));


