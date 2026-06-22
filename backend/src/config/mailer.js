const nodemailer = require('nodemailer');

// Crée le transporter à la demande pour lire les variables d'env au bon moment
const getTransporter = () => nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },
  tls: { rejectUnauthorized: false }
});

module.exports = {
  sendMail: (options) => getTransporter().sendMail(options)
};
