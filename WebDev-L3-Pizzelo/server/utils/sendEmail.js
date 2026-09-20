const getTransporter = require('../config/mailer');

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = await getTransporter();
    await transporter.sendMail({
      from: `"Pizzelo" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
};

module.exports = sendEmail;