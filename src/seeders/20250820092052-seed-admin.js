"use strict";
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashed = await bcrypt.hash("admin123", 10);
    await queryInterface.bulkInsert("Users", [
      {
        fullName: "John Admin",
        birthDate: "1990-01-01",
        email: "admin@example.com",
        password: hashed,
        role: "ADMIN",
        status: "ACTIVE",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", { email: "admin@example.com" });
  },
};
