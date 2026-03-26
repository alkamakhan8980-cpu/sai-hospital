const User = require('./User');
const Appointment = require('./Appointment');
const LabRecord = require('./LabRecord');
const IpdRecord = require('./IpdRecord');
const ActivityLog = require('./ActivityLog');
const Token = require('./Token');

// User -> ActivityLog (One-to-Many)
User.hasMany(ActivityLog, { foreignKey: 'userId', as: 'activityLogs' });
ActivityLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// User -> Token (One-to-Many)
User.hasMany(Token, { foreignKey: 'userId', as: 'tokens' });
Token.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  User,
  Appointment,
  LabRecord,
  IpdRecord,
  ActivityLog,
  Token
};
