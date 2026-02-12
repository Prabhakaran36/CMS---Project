const express = require("express");
const router = express.Router();
const controller = require("../controllers/companyController");

router.post("/create-company", controller.createCompany);

// GET all companies must come BEFORE dynamic route
router.get("/getAllCompany", controller.getAllCompanies);

// GET company by refId
router.get("/:cmpId", controller.getCompanyById);

router.delete("/delete-company/:id", controller.deleteCompany);
router.put("/update-company/:id", controller.updateCompany);

router.post("/:companyId/add-user/:userId", controller.addUserToCompany);
router.delete("/:companyId/remove-user/:userId", controller.removeUserFromCompany);

module.exports = router;
