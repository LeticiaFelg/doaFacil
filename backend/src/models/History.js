const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const History = sequelize.define('History', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  item_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  donor_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  receiver_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  transaction_type: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'concluida'
  },
  notes: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = History;
