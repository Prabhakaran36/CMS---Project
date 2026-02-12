const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    empId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },

    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    designation: DataTypes.STRING,
    dateOfBirth: DataTypes.DATE,
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },

    companyId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    createdDate: DataTypes.STRING,
    updatedDate: DataTypes.STRING,
  },
  {
    tableName: "users",
    timestamps: false,
  }
);

module.exports = User;
