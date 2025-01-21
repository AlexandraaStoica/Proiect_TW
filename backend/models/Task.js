const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  state: {
    type: DataTypes.ENUM('OPEN', 'PENDING', 'COMPLETED', 'CLOSED'),
    allowNull: false,
    defaultValue: 'OPEN'
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  closedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

module.exports = Task;