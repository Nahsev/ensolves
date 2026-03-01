const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "postgresql://neondb_owner:npg_gdUTEHPi6n0r@ep-wild-thunder-ai3wtvfv-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  {
    dialect: "postgres",
    logging: false,
  }
);

module.exports = sequelize;