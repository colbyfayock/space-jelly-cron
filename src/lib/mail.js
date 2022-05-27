const sgMail = require('@sendgrid/mail');
const fetch = require('node-fetch');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * sendMail
 */

async function sendMail({ to = process.env.PRINTER_REFRESH_MAIL_TO, from = process.env.PRINTER_REFRESH_MAIL_FROM, subject, message, attachments = [] }) {
  const errorBase = 'Failed to send mail';

  console.log('Constructing message...');

  const msg = {
    to,
    from,
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

  console.log('Sending mail...');

  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error(`${errorBase}: ${error.message}`);
  }
}

module.exports.sendMail = sendMail;