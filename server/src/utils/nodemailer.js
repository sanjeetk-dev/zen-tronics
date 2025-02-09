import nodemailer from 'nodemailer';
import { config } from '../config/dotenv.js';

// Create a transporter using SMTP configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.smtp_user, 
    pass: config.smtp_pass,
  },
});

const sendOrderEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: config.smtp_user,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    return null;
  }
};

export { sendOrderEmail };
