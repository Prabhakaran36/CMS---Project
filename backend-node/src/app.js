require("dotenv").config();
const express = require("express");
const path = require("path");
const sequelize = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const companyRoutes = require("./routes/companyRoutes");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

require("./models/UserModel");
require("./models/Company");

/* API Routes */
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);

/* Serve React Frontend */
const frontendPath = path.join(__dirname, "../cmsapp/build"); // Path to your React build folder
app.use(express.static(frontendPath));

// ✅ Catch-all route for React Router (safe with newer Express versions)
app.get(/^\/(.*)$/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

/* Connect to Database and Start Server */
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
