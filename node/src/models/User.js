const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: ''
  },
  cpf: {
    type: DataTypes.STRING(11),
    allowNull: true,
    unique: true
  },
  bairro: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: ''
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  avatar: {
    type: DataTypes.STRING(2),
    defaultValue: '👤'
  },
  bio: {
    type: DataTypes.TEXT,
    defaultValue: ''
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  roles: {
    type: DataTypes.JSON,
    defaultValue: ['doador']
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  hooks: {
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 10);
    }
  }
});

User.prototype.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

User.prototype.toJSON = function() {
  const { password, ...user } = this.dataValues;
  return user;
};

module.exports = User;
