const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Token = sequelize.define('Token', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  token: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  isLoggedOut: {
    type: DataTypes.BOOLEAN,
    field: 'is_logged_out',
    defaultValue: false
  },
  userId: {
    type: DataTypes.BIGINT,
    field: 'user_id'
  }
}, {
  tableName: 'tokens',
  timestamps: false
});

module.exports = Token;
