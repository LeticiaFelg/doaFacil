const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Item = sequelize.define('Item', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  emoji: {
    type: DataTypes.STRING(2),
    defaultValue: '📦'
  },
  condition: {
    type: DataTypes.STRING(20),
    defaultValue: 'bom'
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(20),
    defaultValue: 'disponivel'
  },
  donor_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  dimensions: {
    type: DataTypes.STRING(100),
    defaultValue: ''
  },
  material: {
    type: DataTypes.STRING(100),
    defaultValue: ''
  },
  color: {
    type: DataTypes.STRING(50),
    defaultValue: ''
  },
  pickup: {
    type: DataTypes.STRING(255),
    defaultValue: ''
  },
  address: {
    type: DataTypes.JSON,
    defaultValue: {}
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

module.exports = Item;
