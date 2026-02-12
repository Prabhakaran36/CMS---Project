const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./UserModel");

const Company = sequelize.define(
  "Company",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    companyName: DataTypes.STRING,
    companyAddress: DataTypes.STRING,
    refId: { type: DataTypes.STRING },  // ✅ make sure this exists
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
    active: DataTypes.BOOLEAN,
    createdDate: DataTypes.STRING,
    updatedDate: DataTypes.STRING,
  },
  { tableName: "companies", timestamps: false }
);

// Associations
Company.hasMany(User, { foreignKey: "companyId", as: "users" });
User.belongsTo(Company, { foreignKey: "companyId", as: "company" });

module.exports = Company;
