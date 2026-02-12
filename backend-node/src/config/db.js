const { Sequelize } = require("sequelize");
require("dotenv").config();

// Check if DATABASE_URL exists (for optional URL-based config)
const databaseUrl = process.env.DATABASE_URL;

let sequelize;

if (databaseUrl) {
  // DATABASE_URL exists, use it
  sequelize = new Sequelize(databaseUrl, {
    dialect: "mysql", // Change to mysql for MySQL
    logging: false,
  });
} else {
  // Fallback: use individual environment variables
  // Note: match variable names from your .env
  const { DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_PORT } = process.env;

  if (!DB_NAME || !DB_USER || !DB_PASS || !DB_HOST) {
    console.error(
      "❌ Database configuration missing. Please set DATABASE_URL or DB_NAME, DB_USER, DB_PASS, DB_HOST in .env"
    );
    process.exit(1);
  }

  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: DB_PORT || 3306, // default MySQL port
    dialect: "mysql",
    logging: false,
  });
}

// Test the connection
sequelize
  .authenticate()
  .then(() => console.log("✅ DB Connected"))
  .catch((err) => console.error("❌ DB Connection Failed:", err));

module.exports = sequelize;
