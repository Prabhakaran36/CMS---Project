require("dotenv").config();
const express = require("express");
const path = require("path");
const fs = require("fs");
const sequelize = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const companyRoutes = require("./routes/companyRoutes");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Load Models
require("./models/UserModel");
require("./models/Company");

/* -----------------------------
   API Routes
----------------------------- */
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);

/* -----------------------------
   Serve React Frontend (if exists)
----------------------------- */
const frontendPath = path.join(__dirname, "../cmsapp/build");

// Only serve frontend if build folder exists
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));

  // Catch-all route for React Router
  app.get(/^\/(.*)$/, (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });

  console.log("✅ Frontend build folder found. React will be served.");
} else {
  console.warn(
    "⚠️ Frontend build folder not found. Please run 'npm run build' in your React app."
  );
}

/* -----------------------------
   Connect to Database & Start Server
----------------------------- */
sequelize
  .authenticate()
  .then(() => console.log("✅ DB Connected"))
  .catch((err) => console.error("❌ DB Connection Failed:", err));

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ Tables Synced");
    app.listen(process.env.PORT || 8080, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 8080}`)
    );
  })
  .catch((err) => {
    console.error("❌ Sync error:", err);
  });
