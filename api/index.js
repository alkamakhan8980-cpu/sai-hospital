const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const authController = require('./controllers/authController');
const appointmentController = require('./controllers/appointmentController');
const authenticateToken = require('./middleware/auth');
const { User, LabRecord, IpdRecord, ActivityLog } = require('./models');
const sequelize = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// Admin Seeding Function
const seedAdmin = async () => {
  try {
    const adminEmail = 'khatrikhan657@gmail.com';
    const existing = await User.findOne({ where: { email: adminEmail } });
    if (!existing) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'khatrikhan',
        email: adminEmail,
        phoneNumber: '0000000000',
        password: hashedPassword,
        role: 'DOCTOR'
      });
      console.log('====== DEFAULT ADMIN CREATED: khatrikhan657@gmail.com / admin123 ======');
    }
  } catch (e) {
    console.error('Seeding failed:', e);
  }
};

// Initialize DB and Seed
sequelize.authenticate().then(seedAdmin).catch(console.error);

// Global Activity Logging Middleware
app.use(async (req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method) && !req.path.includes('/auth/login')) {
    const userId = req.user ? req.user.id : null;
    try {
      await ActivityLog.create({
        userId,
        action: req.method,
        details: `${req.method} ${req.path} - ${JSON.stringify(req.body).substring(0, 500)}`
      });
    } catch (e) { console.error('Log failed:', e); }
  }
  next();
});

// Auth Routes (Public)
app.post('/api/auth/login', authController.login);
app.post('/api/auth/signup', authController.signup);
app.post('/api/auth/send-otp', authController.sendOtp);
app.post('/api/auth/forgot-password', authController.forgotPassword);
app.post('/api/auth/reset-password', authController.resetPassword);

// Appointment Routes
app.get('/api/appointments', authenticateToken, appointmentController.getAllAppointments);
app.post('/api/appointments', appointmentController.createAppointment); // Public for patients
app.put('/api/appointments/:id', authenticateToken, appointmentController.updateAppointment);
app.delete('/api/appointments/:id', authenticateToken, appointmentController.deleteAppointment);

// Lab Record Routes (Protected)
app.get('/api/lab-records', authenticateToken, async (req, res) => {
  const records = await LabRecord.findAll();
  res.json(records);
});
app.post('/api/lab-records', authenticateToken, async (req, res) => {
  const record = await LabRecord.create(req.body);
  res.json(record);
});
app.delete('/api/lab-records/:id', authenticateToken, async (req, res) => {
  await LabRecord.destroy({ where: { id: req.params.id } });
  res.status(204).send();
});

// IPD Record Routes (Protected)
app.get('/api/ipd-records', authenticateToken, async (req, res) => {
  const records = await IpdRecord.findAll();
  res.json(records);
});
app.post('/api/ipd-records', authenticateToken, async (req, res) => {
  const record = await IpdRecord.create(req.body);
  res.json(record);
});
app.put('/api/ipd-records/:id', authenticateToken, async (req, res) => {
  const record = await IpdRecord.findByPk(req.params.id);
  if (record) {
    await record.update(req.body);
    res.json(record);
  } else res.status(404).json({ message: 'Not found' });
});

// Activity Logs (Protected)
app.get('/api/activity-logs', authenticateToken, async (req, res) => {
  const logs = await ActivityLog.findAll({
    include: ['user'],
    order: [['timestamp', 'DESC']]
  });
  res.json(logs);
});

// Root check
app.get('/api', (req, res) => {
  res.json({ message: 'Sai Hospital Node.js Backend is running!' });
});

// For local testing
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
