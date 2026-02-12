require("dotenv").config();
const express = require("express");
const sequelize = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const companyRoutes = require("./routes/companyRoutes");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

require("./models/UserModel");
require("./models/Company");


sequelize.sync({ alter: true })
  .then(() => {
    console.log("✅ Tables Synced");
    app.listen(process.env.PORT || 8080, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 8080}`)
    );
  })
  .catch((err) => {
    console.error("❌ Sync error:", err);
  });

/* Routes */
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);
