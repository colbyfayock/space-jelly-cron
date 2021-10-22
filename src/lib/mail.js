const sgMail = require('@sendgrid/mail');
const fetch = require('node-fetch');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * sendMail
 */

async function sendMail({ subject, message, attachments = [] }) {
  const errorBase = 'Failed to send mail';

  const msg = {
    to: process.env.MAIL_TO,
    from: process.env.MAIL_FROM,
    subject,
    text: message,
    html: message.replace(/\r\n/g, '<br>'),
  };

  if ( attachments.length > 0 ) {
    msg.attachments = await Promise.all(attachments.map(async ({ url, type, filename } = {}) => {
      const response = await fetch(url);
      const buffer = await response.buffer();

      return {
        content: buffer.toString('base64'),
        filename,
        type,
        disposition: 'attachment',
      }
    }))
  }

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(`${errorBase}: ${error.message}`);
  }
}

module.exports.sendMail = sendMail;