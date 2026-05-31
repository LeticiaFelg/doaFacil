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
    allowNull: false,
    defaultValue: 'outros'
  },
  emoji: {
    type: DataTypes.STRING(16),
    defaultValue: '📦'
  },
  condition: {
    type: DataTypes.STRING(20),
    defaultValue: 'bom'
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: ''
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
    type: DataTypes.JSONB,
    defaultValue: []
  }
});

module.exports = Item;
