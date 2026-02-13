
const { getCurrentTime } = require("../utils/commonValidations");
const User = require("../models/UserModel");  // make sure the file is actually 'User.js'


// CREATE or UPDATE
async function createUser(req, res) {
  try {
    const userRequest = req.body;
    const cmsDate = getCurrentTime();

    let user = await User.findOne({ where: { empId: userRequest.empId } });
    const isNew = !user;

    if (isNew) user = User.build({ createdDate: cmsDate });
    else user.updatedDate = cmsDate;

    user.firstName = userRequest.firstName;
    user.lastName = userRequest.lastName;
    user.email = userRequest.email;
    user.designation = userRequest.designation;
    user.dateOfBirth = userRequest.dateOfBirth;
    user.active = userRequest.active;
    user.empId = userRequest.empId;
    user.companyId = userRequest.companyId || null;

    await user.save();

    res.json({
      status: "Success",
      message: isNew ? "User Created Successfully" : "User Updated Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "Error", message: "Internal server error" });
  }
}

// GET by empId
async function getUserById(req, res) {
  try {
    const { empId } = req.params;
    const user = await User.findOne({ where: { empId } });

    if (!user)
      return res.status(404).json({ status: "Error", message: `User with ID ${empId} not found` });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "Error", message: "Internal server error" });
  }
}

// GET all users
async function getAllUsers(req, res) {
  try {
    const users = await User.findAll();
    if (!users || users.length === 0) return res.status(204).send();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "Error", message: "Internal server error" });
  }
}

// DEACTIVATE user
async function deactivateUser(req, res) {
  try {
    const { empId } = req.params;
    const user = await User.findOne({ where: { empId } });

    if (!user)
      return res.status(404).json({ status: "Error", message: `User with ID ${empId} not found` });

    user.active = false;
    user.updatedDate = getCurrentTime();
    await user.save();

    res.json({ status: "Success", message: "User deactivated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "Error", message: "Internal server error" });
  }
}

// DELETE user
async function deleteUser(req, res) {
  try {
    const { empId } = req.params;
    const user = await User.findOne({ where: { empId } });

    if (!user)
      return res.status(404).json({ status: "Error", message: `User with ID ${empId} not found` });

    await user.destroy();
    res.json({ status: "Success", message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "Error", message: "Internal server error" });
  }
}

// UPDATE user
async function updateUser(req, res) {
  try {
    const { empId } = req.params;
    const userRequest = req.body;

    const user = await User.findOne({ where: { empId } });
    if (!user)
      return res.status(404).json({ status: "Error", message: `User with ID ${empId} not found` });

    user.firstName = userRequest.firstName;
    user.lastName = userRequest.lastName;
    user.email = userRequest.email;
    user.designation = userRequest.designation;
    user.dateOfBirth = userRequest.dateOfBirth;
    user.active = userRequest.active;
    user.updatedDate = getCurrentTime();

    await user.save();
    res.json({ status: "Success", message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "Error", message: "Internal server error" });
  }
}

module.exports = { createUser, getUserById, getAllUsers, deactivateUser, deleteUser, updateUser };
