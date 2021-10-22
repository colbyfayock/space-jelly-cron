const sgMail = require('@sendgrid/mail');
const fetch = require('node-fetch');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * sendMail
 */

async function sendMail({ subject, message, attachments = [] }) {
  const errorBase = 'Failed to send mail';

  const msg = {
    to: process.env.PRINTER_REFRESH_MAIL_TO,
    from: process.env.PRINTER_REFRESH_MAIL_FROM,
    subject,
    text: message,
    html: message.replace(/\r\n/g, '<br>'),
  };

  console.log(`Found ${attachments.length} attachments...`);

  if ( attachments.length > 0 ) {
    msg.attachments = await Promise.all(attachments.map(async ({ url, type, filename } = {}, index) => {
      console.log(`Processing attachment ${index + 1} / ${attachments.length}`)
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