const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const LabRecord = sequelize.define('LabRecord', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  test: { type: DataTypes.STRING },
  name: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  contact: { type: DataTypes.STRING },
  gender: { type: DataTypes.STRING },
  age: { type: DataTypes.INTEGER },
  date: { type: DataTypes.STRING },
  reportStatus: {
    type: DataTypes.STRING,
    field: 'report_status'
  }
}, {
  tableName: 'lab_records',
  timestamps: false
});

module.exports = LabRecord;
