const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Appointment = sequelize.define('Appointment', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  fullName: {
    type: DataTypes.STRING,
    field: 'full_name'
  },
  age: {
    type: DataTypes.INTEGER
  },
  gender: {
    type: DataTypes.STRING
  },
  contact: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.STRING
  },
  disease: {
    type: DataTypes.STRING
  },
  appointmentDate: {
    type: DataTypes.STRING,
    field: 'appointment_date'
  },
  appointmentTime: {
    type: DataTypes.STRING,
    field: 'appointment_time'
  },
  scheduledDate: {
    type: DataTypes.STRING,
    field: 'scheduled_date'
  },
  scheduledTime: {
    type: DataTypes.STRING,
    field: 'scheduled_time'
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'PENDING'
  },
  visitStatus: {
    type: DataTypes.STRING,
    defaultValue: 'PENDING',
    field: 'visit_status'
  }
}, {
  tableName: 'appointments',
  timestamps: false
});

module.exports = Appointment;
