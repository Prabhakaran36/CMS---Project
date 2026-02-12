const express = require("express");
const router = express.Router();

const {
  createUser,
  getUserById,
  getAllUsers,
  deactivateUser,
  deleteUser,
  updateUser,
} = require("../controllers/userController");

// Routes
router.post("/createuser", createUser);              // Create
router.get("/find-user/:empId", getUserById);       // Get by ID
router.get("/users", getAllUsers);                 // Get all
router.put("/:empId/deactivate", deactivateUser);  // Deactivate
router.put("/users/:empId", updateUser);           // Update
router.delete("/users/:empId", deleteUser);        // Delete




module.exports = router;
