const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SPRING_MAIL_USERNAME,
    pass: process.env.SPRING_MAIL_PASSWORD,
  },
  debug: true,
  logger: true
});

const otpStorage = new Map();

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.SPRING_MAIL_USERNAME,
    to,
    subject,
    text
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
  }
};

const sendOtp = async (email) => {
  const otp = generateOtp();
  otpStorage.set(email, otp);
  
  const subject = "Sai Hospital - Verification Code";
  const text = `Your OTP is: ${otp}\n\nIf you did not request this, please ignore.`;
  
  await sendEmail(email, subject, text);
};

const sendPasswordResetOtp = async (email) => {
  const otp = generateOtp();
  otpStorage.set(email, otp);

  const subject = "Password Reset Request - Sai Hospital";
  const text = `Dear User,\n\nWe received a request to reset your password.\n\nOTP: ${otp}\n\nValid for 10 minutes.`;
  
  await sendEmail(email, subject, text);
};

const verifyOtp = (email, otp) => {
  if (otpStorage.has(email) && otpStorage.get(email) === otp) {
    otpStorage.delete(email);
    return true;
  }
  return false;
};

const sendNotification = async (email, subject, text) => {
  if (email) {
    await sendEmail(email, subject, text);
  }
};

module.exports = {
  sendOtp,
  sendPasswordResetOtp,
  verifyOtp,
  sendNotification
};
