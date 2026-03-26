const { Appointment } = require('../models');
const otpService = require('../services/otpService');

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      order: [['id', 'DESC']]
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments' });
  }
};

const createAppointment = async (req, res) => {
  try {
    const data = req.body;
    if (!data.status) data.status = 'PENDING';
    if (!data.visitStatus) data.visitStatus = 'PENDING';
    
    const appointment = await Appointment.create(data);

    // Send Receipt Email
    const subject = "Appointment Request Received";
    const text = `Your appointment request has been successfully received.\nOur team will review it and notify you soon.`;
    
    await otpService.sendNotification(appointment.email, subject, text);

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create appointment' });
  }
};

const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const details = req.body;

  try {
    const appointment = await Appointment.findByPk(id);
    if (!appointment) return res.status(404).json({ message: 'Not found' });

    const oldStatus = appointment.status;
    await appointment.update(details);
    const newStatus = appointment.status;

    // Trigger Notifications if status changed
    if (newStatus && newStatus !== oldStatus) {
      if (newStatus === 'APPROVED') {
        const subject = "Appointment Confirmation - Sai Hospital";
        const text = `Dear ${appointment.fullName},\n\nYour appointment is APPROVED!\nDate: ${appointment.scheduledDate || 'TBD'}\nTime: ${appointment.scheduledTime || 'TBD'}`;
        await otpService.sendNotification(appointment.email, subject, text);
      } else if (newStatus === 'REJECTED') {
        const subject = "Appointment Update";
        const text = `We regret to inform you that your appointment request has been rejected.`;
        await otpService.sendNotification(appointment.email, subject, text);
      }
    }

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Update failed' });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    await Appointment.destroy({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Delete failed' });
  }
};

module.exports = {
  getAllAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment
};
