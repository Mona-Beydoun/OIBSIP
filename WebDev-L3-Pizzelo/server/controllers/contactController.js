const sendEmail = require('../utils/sendEmail');

const submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are all required' });
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color:#E8792F;">New Contact Message — Pizzelo</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        <p style="white-space: pre-wrap; border-top: 1px solid #eee; padding-top: 12px;">${message}</p>
      </div>
    `;

    await sendEmail(process.env.EMAIL_USER, `Pizzelo Contact Form: ${name}`, html);

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Could not send message. Please try again later.' });
  }
};

module.exports = { submitContactForm };