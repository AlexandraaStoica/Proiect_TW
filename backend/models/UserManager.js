const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserManager = sequelize.define('UserManager', {
  assignedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = UserManager;