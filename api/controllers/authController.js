const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, ActivityLog, Token } = require('../models');
const otpService = require('../services/otpService');
const { Op } = require('sequelize');

const login = async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: identifier },
          { phoneNumber: identifier }
        ]
      }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Save token to DB
    await Token.create({ token, userId: user.id });

    // Log Activity
    await ActivityLog.create({
      userId: user.id,
      action: 'LOGIN',
      details: `Logged in from ${req.ip}`
    });

    res.json({
      success: true,
      token,
      user: user.name,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const signup = async (req, res) => {
  const { name, email, phoneNumber, password, otp } = req.body;

  try {
    if (!otpService.verifyOtp(email, otp)) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      role: 'STAFF'
    });

    await ActivityLog.create({
      userId: user.id,
      action: 'SIGNUP',
      details: 'New account created'
    });

    res.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

const sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    await otpService.sendOtp(email);
    res.json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    await otpService.sendPasswordResetOtp(email);
    res.json({ success: true, message: 'Reset code sent to email' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to initiate reset' });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    if (!otpService.verifyOtp(email, otp)) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashedPassword }, { where: { email } });

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reset password' });
  }
};

module.exports = {
  login,
  signup,
  sendOtp,
  forgotPassword,
  resetPassword
};
