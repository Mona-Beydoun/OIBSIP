const nodemailer = require('nodemailer');
const dns = require('dns');

let cachedTransporter = null;

const getTransporter = () => {
  return new Promise((resolve, reject) => {
    if (cachedTransporter) return resolve(cachedTransporter);

    dns.lookup('smtp.gmail.com', { family: 4 }, (err, address) => {
      if (err) return reject(err);

      cachedTransporter = nodemailer.createTransport({
        host: address,
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        tls: {
          servername: 'smtp.gmail.com',
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
      });

      resolve(cachedTransporter);
    });
  });
};

module.exports = getTransporter;