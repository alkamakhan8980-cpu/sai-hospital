const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const IpdRecord = sequelize.define('IpdRecord', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  patientName: {
    type: DataTypes.STRING,
    field: 'patient_name'
  },
  age: { type: DataTypes.INTEGER },
  gender: { type: DataTypes.STRING },
  disease: { type: DataTypes.STRING },
  wardBedNo: {
    type: DataTypes.STRING,
    field: 'ward_bed_no'
  },
  address: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  contact: { type: DataTypes.STRING },
  admissionDate: {
    type: DataTypes.DATE,
    field: 'admission_date'
  },
  dischargeDate: {
    type: DataTypes.DATE,
    field: 'discharge_date'
  },
  status: { type: DataTypes.STRING },
  totalBill: {
    type: DataTypes.DOUBLE,
    field: 'total_bill'
  }
}, {
  tableName: 'ipd_records',
  timestamps: false
});

module.exports = IpdRecord;
