const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: 'phone_number'
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'STAFF'
  },
  lastLogin: {
    type: DataTypes.DATE,
    field: 'last_login'
  },
  lastLogout: {
    type: DataTypes.DATE,
    field: 'last_logout'
  }
}, {
  tableName: 'users',
  timestamps: false
});

module.exports = User;
