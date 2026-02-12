const Company = require("../models/Company");

const { getCurrentTime, getCoordinates } = require("../utils/commonValidations");
const geoService = require("../services/GeoService");
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("../models/UserModel");




// Create Company
async function createCompany(req, res) {
  try {
    const { companyName, companyAddress, refId } = req.body;

    // Get coordinates (if you want to override the sent lat/lon)
    const [lat, lon] = await geoService.getCoordinates(companyAddress);

    const newCompany = await Company.create({
      companyName,
      companyAddress,
      refId,          // <-- include refId here!
      latitude: lat,  // or use req.body.latitude if you want
      longitude: lon, // or use req.body.longitude
      active: req.body.active ?? true,
      createdDate: new Date().toISOString(),
    });

    res.json({
      status: "Success",
      message: "Company created successfully",
      company: newCompany,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "Error", message: "Internal server error" });
  }
}


// Get company by refId
async function getCompanyById(req, res) {
  try {
    const { cmpId } = req.params;
    const company = await Company.findOne({ where: { refId: cmpId }, include: "users" });
    if (!company) return res.status(404).json({ status: "Failure", message: `Company ${cmpId} not found` });
    res.json(company);
  } catch (error) {
    res.status(500).json({ status: "Failure", message: error.message });
  }
}

// Get all companies
async function getAllCompanies(req, res) {
  try {
    const companies = await Company.findAll({
      include: [{ model: User, as: "users" }],
    });

    res.json({ status: "Success", companies });
  } catch (error) {
    res.status(500).json({ status: "Failure", message: error.message });
  }
}


// Delete company
async function deleteCompany(req, res) {
  try {
    const { id } = req.params;
    const company = await Company.findByPk(id);
    if (!company) return res.status(404).json({ status: "Failure", message: `Company ${id} not found` });
    await company.destroy();
    res.json({ status: "Success", message: `Company deleted successfully with ID: ${id}` });
  } catch (error) {
    res.status(500).json({ status: "Failure", message: error.message });
  }
}


// Update company
async function updateCompany(req, res) {
  try {
    const { id } = req.params;
    const { companyName, companyAddress, active } = req.body;

    const company = await Company.findByPk(id);
    if (!company) 
      return res.status(404).json({ status: "Failure", message: `Company ${id} not found` });

    if (companyName) company.companyName = companyName;

    if (companyAddress) {
      company.companyAddress = companyAddress;

      // Use geoService to get coordinates
      const [lat, lon] = await geoService.getCoordinates(companyAddress);
      company.latitude = lat;
      company.longitude = lon;
    }

    if (active !== undefined) company.active = active;

    company.updatedDate = new Date().toISOString(); // Or getCurrentTime() if you have it

    await company.save();

    res.json({ status: "Success", message: "Company updated", company });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "Failure", message: error.message });
  }
}


// Add user to company
async function addUserToCompany(req, res) {
  try {
    const { companyId, userId } = req.params;
    const company = await Company.findByPk(companyId);
    if (!company) throw new Error("Company not found");
    const user = await User.findByPk(userId);
    if (!user) throw new Error("User not found");

    user.companyId = companyId;
    await user.save();

    res.json({ status: "Success", message: "User added to company" });
  } catch (error) {
    res.status(400).json({ status: "Failure", message: error.message });
  }
}

// Remove user from company
async function removeUserFromCompany(req, res) {
  try {
    const { companyId, userId } = req.params;
    const user = await User.findOne({ where: { id: userId, companyId } });
    if (!user) throw new Error("User not found in this company");

    user.companyId = null;
    await user.save();

    res.json({ status: "Success", message: "User removed from company" });
  } catch (error) {
    res.status(400).json({ status: "Failure", message: error.message });
  }
}

module.exports = {
  createCompany,
  getCompanyById,
  getAllCompanies,
  deleteCompany,
  updateCompany,
  addUserToCompany,
  removeUserFromCompany,
};
